var Placemark = React.createClass({
    getInitialState: function() {
        this.props.map.geoObjects.add(this.props.placemark);

        return {};
    },

    hidePlacemark: function (e){
        if (this.props.placemark.isDisplay){
            this.props.map.geoObjects.remove(this.props.placemark);
        }
        else{
            this.props.map.geoObjects.add(this.props.placemark);
        }
        
        this.props.placemark.isDisplay = !this.props.placemark.isDisplay
        
        this.setState({});
    },
    
    render: function() {
        return (
            <div className="placemark">
                <div> 
                    <div>
                        name: 
                        <span contentEditable disableContentEditableWarning onBlur={this.props.changePlacemark} key={this.props.index} className="name">
                            {this.props.placemark.properties.getAll().hintContent}
                        </span>
                    </div>
                    
                    <div>
                        latitude: <span className="latitude"> {this.props.placemark.geometry.getCoordinates()[0]}</span>
                        longitude: <span className="longitude"> {this.props.placemark.geometry.getCoordinates()[1]}</span>
                    </div>
                </div>
                
                <button onClick={this.props.deletePlacemark} value={this.props.index} className="btn_remove button">Remove</button>
                <button className={ this.props.placemark.isDisplay ? 'button active btn_hide' : 'button btn_hide' }
                    onClick={this.hidePlacemark}>Hide</button>
            </div>
        );
    }
});

var Placemarks = React.createClass({

    getInitialState: function() {
        var myMap = new ymaps.Map('map', {
            center: [56.63, 47.89],
            zoom: 11
        });
        
        ymaps.geolocation.get({ provider: 'yandex', mapStateAutoApply: true}).then(function (result) {
            result.geoObjects.options.set('preset', 'islands#redCircleIcon');
            result.geoObjects.get(0).properties.set({balloonContentBody: 'Мое местоположение'});
            myMap.geoObjects.add(result.geoObjects);
        });


        var placemarks = [];
        for(var i = 0; i < this.props.placemarks.length; i++){
            this.props.placemarks[i];
            var myPlacemark = new ymaps.Placemark(  [this.props.placemarks[i].latitude, this.props.placemarks[i].longitude], { 
                                                    hintContent: this.props.placemarks[i].name, 
                                                    balloonContent: this.props.placemarks[i].name });
            myPlacemark.isDisplay = true;

            placemarks.push(myPlacemark);
        }

        return {
            map: myMap,
            displayedPlacemarks: placemarks,
        };
    },
    
    changePlacemark: function(e){
        var index, placemarks, latitude, longitude, name, myPlacemark

        index = parseInt(e.dispatchMarker.split('$')[2], 10);
        placemarks = this.state.displayedPlacemarks

        latitude = placemarks[index].geometry.getCoordinates()[0] 
        longitude = placemarks[index].geometry.getCoordinates()[1]
        name = e.target.innerText

        myPlacemark = new ymaps.Placemark([latitude, longitude], { 
            hintContent: name, 
            balloonContent: name 
        });

        myPlacemark.isDisplay = placemarks[index].isDisplay;

        if(myPlacemark.isDisplay){
            this.state.map.geoObjects.remove(placemarks[index]);
            this.state.map.geoObjects.add(myPlacemark);
        }

        placemarks[index] = myPlacemark
        
        this.setState({
            map: this.state.map,
            displayedPlacemarks: placemarks,
        });
    },

    deletePlacemark: function(e) {
        var index, placemarks

        index = parseInt(e.target.value, 10);

        this.state.map.geoObjects.remove(this.state.displayedPlacemarks[index]);

        placemarks = this.state.displayedPlacemarks;
        placemarks.splice(index, 1);

        this.setState({
            map: this.state.map,
            displayedPlacemarks: placemarks,
        });
    },

    preventDefault: function (event) {
        event.preventDefault();
    },

    drop: function (e) {
        var file = e.dataTransfer.files[0], reader = new FileReader();
        
        e.preventDefault();
        
        var self = this;
        reader.onload = function(event) {
            var latitude, longitude, name, id, myPlacemark, fileJson, placemarks;
            fileJson =  JSON.parse(event.target.result);

            placemarks = self.state.displayedPlacemarks;
            
            for (var i = 0; i < fileJson.length; i++) {

                latitude =  fileJson[i].coordinates.latitude;
                longitude = fileJson[i].coordinates.longitude;
                name =      fileJson[i].name;

                var myPlacemark = new ymaps.Placemark([latitude, longitude], { 
                    hintContent: name, 
                    balloonContent: name 
                });

                myPlacemark.isDisplay = true;

                placemarks.push(myPlacemark);
            }

            self.setState({
                map: self.state.map,
                displayedPlacemarks: placemarks,
            });      
        };

        reader.readAsText(file);
    },

    addPlacemark:function (e){
        e.preventDefault();
        var placemarks, name, latitude, longitude, myPlacemark

        placemarks = this.state.displayedPlacemarks;

        name = this.refs.name.getDOMNode().value 
        latitude = this.refs.latitude.getDOMNode().value
        longitude = this.refs.longitude.getDOMNode().value

        this.refs.name.getDOMNode().value = ''
        this.refs.latitude.getDOMNode().value = ''
        this.refs.longitude.getDOMNode().value = ''

        myPlacemark = new ymaps.Placemark([latitude, longitude], { 
            hintContent: name, 
            balloonContent: name 
        });

        myPlacemark.isDisplay = true;

        placemarks.push(myPlacemark);

        this.setState({
            map: this.state.map,
            displayedPlacemarks: this.state.displayedPlacemarks,
        });

    },

    filterPlacemarks: function(e){
        e.preventDefault();
        var placemarks, radius, center_latitude, center_longitude
        var displayedPlacemarksFilte = []

        placemarks = this.state.displayedPlacemarks;

        radius = this.refs.radius.getDOMNode().value 
        center_latitude = this.refs.center_latitude.getDOMNode().value
        center_longitude = this.refs.center_longitude.getDOMNode().value

        var circleGeometry = new ymaps.geometry.Circle([center_latitude, center_longitude], radius);
        circleGeometry.options.setParent(this.state.map.options);
        circleGeometry.setMap(this.state.map);

        for(var i = 0; i < placemarks.length; i++){

            if(circleGeometry.contains([placemarks[i].geometry.getCoordinates()[0], 
                                        placemarks[i].geometry.getCoordinates()[1]])){
                displayedPlacemarksFilte.push(placemarks[i])
                
                if(!placemarks[i].isDisplay){
                    this.state.map.geoObjects.add(placemarks[i]);
                }
                placemarks[i].isDisplay = true
            }
            else{
                if(placemarks[i].isDisplay){
                    this.state.map.geoObjects.remove(placemarks[i]);
                }
                placemarks[i].isDisplay = false
            }
        }

        this.setState({
            map: this.state.map,
            displayedPlacemarks: placemarks,
        });
    },

    render: function(){
        var self = this;
        
        function saveLocaleStorage (){

            var placemarks_json = [];
            for(var i = 0; i < self.state.displayedPlacemarks.length; i++){
                var name = self.state.displayedPlacemarks[i].properties.getAll().hintContent;
                var latitude = self.state.displayedPlacemarks[i].geometry.getCoordinates()[0];
                var longitude = self.state.displayedPlacemarks[i].geometry.getCoordinates()[1];

                placemarks_json.push({"name": name, "latitude": latitude, "longitude": longitude});
            }

            localStorage.setItem("placemarks", JSON.stringify(placemarks_json));
        }
        

        saveLocaleStorage();
        var placemarkList = this.state.displayedPlacemarks.map(function(s, i){
            return <Placemark placemark={s} key={i} index={i}   deletePlacemark={self.deletePlacemark}
                                                                changePlacemark={self.changePlacemark}
                                                                map={self.state.map}/>;
        });

        return  <div>
                    <div id="holder" onDragOver={this.preventDefault} onDrop={this.drop}>
                        drag file here
                    </div>
                    

                    <h2>Placemarks </h2>
                    
                    <div id="placemarks">
                        {placemarkList}
                        
                        <hr/>

                        <form onSubmit={this.addPlacemark}>
                        
                            <div className="container-fluid">   
                                <div className="row">
                                    <div className="col-xs-12"><input type="text" ref="name" placeholder="name" id="addName"/></div>
                                    <div className="col-xs-12"><input type="number" step="any" ref="latitude" placeholder="latitude" id="addLatitude"/></div>
                                    <div className="col-xs-12"><input type="number" step="any" ref="longitude" placeholder="longitude" id="addLongitude"/></div>
                                </div>
                            </div>  

                            <button id="addPlacemark"> add placemark </button>  
                        </form>   
                    </div>
                    <hr/>
                    <h4>Filter </h4>
                    <div id="filter">
                        <form onSubmit={this.filterPlacemarks}>
                        
                            <div className="container-fluid">   
                                <div className="row">
                                    <div className="col-xs-12"><input type="number" ref="radius" placeholder="radius" id="filterRadius"/></div>
                                    <div className="col-xs-12"><input type="number" step="any" ref="center_latitude" placeholder="latitude" id="filterLatitude"/></div>
                                    <div className="col-xs-12"><input type="number" step="any" ref="center_longitude" placeholder="longitude" id="filterLongitude"/></div>
                                </div>
                            </div>  

                            <button id="addFilter"> display </button>  
                        </form>  
                    </div>
                </div>;              
    }
});