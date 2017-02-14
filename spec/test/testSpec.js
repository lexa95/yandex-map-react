describe("Test yandex map", function() {
	
	beforeEach(function(done) {
		ymaps.ready(function() {
			ReactDOM.render(
				React.createElement(Placemarks, {placemarks: []}), document.getElementById('content')
			);
			done();
		});
	});

	it("Test add placemarks", function() {
		var placemarks, name, latitude, longitude, isFind;
		$("#addName").val("Карп Карпыч");
		$("#addLatitude").val("56.634761");
		$("#addLongitude").val("47.892854");
		$("#addPlacemark").trigger('click');
		
		placemarks = $(".placemark")
		isFind = false;

		for(i = 0; i < placemarks.length; i++){
			name = 		$(placemarks[i]).find(".name").text();
			latitude = 	$(placemarks[i]).find(".latitude").text()
			longitude = $(placemarks[i]).find(".longitude").text()

			if(name == "Карп Карпыч" &&  Number(latitude) == Number("56.634761") && Number(longitude) ==  Number("47.892854")){
				isFind = true;
			}
		}
		expect(isFind).toEqual(true);
	});

	it("Test hide placemarks", function() {
		var placemarks
		
		placemarks = $(".placemark")
		placemark = $(placemarks[0]).find(".active")
		
		placemark.trigger('click')
		expect($(placemarks[0]).find(".active")[0]).toEqual(undefined);
		placemark.trigger('click')
		expect($(placemarks[0]).find(".active")[0] != undefined).toEqual(true);
	});

	it("Test remove placemarks", function() {
		var name, latitude, longitude, isFind;

		placemarks = $(".placemark")
		isFind = false;

		// remove
		for(i = 0; i < placemarks.length; i++){
			name 		=	$(placemarks[i]).find(".name").text();
			latitude 	= 	$(placemarks[i]).find(".latitude").text()
			longitude 	= 	$(placemarks[i]).find(".longitude").text()

			if(name == "Карп Карпыч" &&  Number(latitude) == Number("56.634761") && Number(longitude) ==  Number("47.892854")){
				$(placemarks[i]).find(".btn_remove").trigger('click');
			}
		}

		// find
		placemarks = $(".placemark")
		for(i = 0; i < placemarks.length; i++){
			name 		=	$(placemarks[i]).find(".name").text();
			latitude 	= 	$(placemarks[i]).find(".latitude").text()
			longitude 	= 	$(placemarks[i]).find(".longitude").text()

			if(name == "Карп Карпыч" &&  Number(latitude) == Number("56.634761") && Number(longitude) ==  Number("47.892854")){
				isFind = true;
			}
		}

		expect(isFind).toEqual(false);
	});

	it("Test filter placemarks", function() {
		var placemarks, name, isFindP1, isFindP2;
		
		// add point 1
		$("#addName").val("point1");
		$("#addLatitude").val("56.630497");
		$("#addLongitude").val("47.89214");
		$("#addPlacemark").trigger('click');
		
		// add point 2
		$("#addName").val("point2");
		$("#addLatitude").val("56.634761");
		$("#addLongitude").val("47.892854");
		$("#addPlacemark").trigger('click');
		

		// add filter
		$("#filterRadius").val("500");
		$("#filterLatitude").val("56.63404");
		$("#filterLongitude").val("47.899279");
		$("#addFilter").trigger('click');

		//inspection 
		isFindP1 = false
		isFindP2 = false
		placemarks = $(".placemark")
		for(i = 0; i < placemarks.length; i++){
			name 		=	$(placemarks[i]).find(".name").text();

			if(name == "point1" && $(placemarks[i]).find(".active")[0] != undefined){
				isFindP1 = true;
			}
			else if(name == "point2" && $(placemarks[i]).find(".active")[0] != undefined){
				isFindP2 = true;
			}
		}
		
		expect(isFindP1).toEqual(false);
		expect(isFindP2).toEqual(true);

	});
});
