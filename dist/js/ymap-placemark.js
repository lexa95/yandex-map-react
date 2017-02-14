ymaps.ready(init);

function init(){ 

    if(!localStorage.getItem('placemarks')) {
        var placemarks_json = [];
        localStorage.setItem('placemarks', JSON.stringify(placemarks_json));
    }

    ReactDOM.render(
        React.createElement(Placemarks, {placemarks: JSON.parse(localStorage.getItem("placemarks"))}), document.getElementById('content')
    );
}
