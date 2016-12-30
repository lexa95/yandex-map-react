var React = require("react");
var ReactDom = require('react-dom');
var ReactTestUtils = require('react-addons-test-utils')

var Placemarks = require('../../dist/js/placemarks.js').placemarks;
// var Placemark = require('../../dist/js/placemarks.js').placemark;


describe("Test", function() {
	
	beforeEach(function() {
		const renderer = ReactTestUtils.createRenderer();
		React.createElement(Placemarks, {placemarks: []});
	});

	it("test", function() {
		// ReactTestUtils.renderIntoDocument(Placemarks);
		expect(1).toEqual(1);
	});
});