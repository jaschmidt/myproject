import Ember from 'ember';

var Photo = Ember.Object.extend({
	title: '',
	username: '',
	//flickr extra data
	owner: '',
	//flickr url data
	id: '',
	farm: 0,
	secret: '',
	server: '',
	url: function(){
		return "https://farm"+this.get('farm')+
		".staticflickr.com/"+this.get('server')+
		"/"+this.get('id')+"_"+this.get('secret')+"_b.jpg";
	}.property('farm','server','id','secret'),
});

var PhotoCollection = Ember.ArrayProxy.extend(Ember.SortableMixin, {
	sortProperties: ['title'],
	sortAscending: true,
	content: [],
});

var testPhotos = PhotoCollection.create();
var testimg1 = Photo.create({
	title: "Google logo",
	username: "google",
	url: "https://www.google.com/images/srpr/logo11w.png"
});

var testimg2 = Photo.create({
	title: "UNO logo",
	username: "UNO",
	url: "http://www.unomaha.edu/_files/images/logo-subsite-o-2.png"
});

var testimg3 = Photo.create({
	title: "Facebook Logo",
	username: "Facebook",
	url: "https://www.facebook.com/images/fb_icon_325x325.png"
});

var testimg4 = Photo.create({
	title: "Hubble Carina Nebula",
	username: "NASA",
	url: "http://imgsrc.hubblesite.org/hu/db/images/hs-2010-13-a-1920x1200_wallpaper.jpg"
});

testPhotos.pushObject(testimg1);
testPhotos.pushObject(testimg2);
testPhotos.pushObject(testimg3);
testPhotos.pushObject(testimg4);

export default Ember.Controller.extend({
	photos: testPhotos,
	searchField: '',
	filteredPhotos: function () {
		var filter = this.get('searchField');
		var rx = new RegExp(filter, 'gi');
		var photos = this.get('photos');

		return photos.filter(function(photo){
			return photo.get('title').match(rx) || photo.get('username').match(rx);
		});
	}.property('photos','searchField'),
	actions: {
		search: function () {
			this.get('filteredPhotos');
		},
		getPhotos: function(){
			var apiKey = '04b171abc60a3fd894de77b856b4984d';
			var host = 'https://api.flickr.com/services/rest/';
			var method = "flickr.tags.getClusterPhotos";
			var tag = "face";
			var requestURL = host + "?method="+method + "&api_key="+apiKey+"&tag="+tag+"&format=json&nojsoncallback=1";
			var photos = this.get('photos');
			Ember.$.getJSON(requestURL, function(data){
				//callback for successfully completed requests
				console.log(data);
				data.photos.photo.map(function(photo) {
					var newPhotoItem = Photo.create({
						title: photo.title,
						username: photo.username,
						//flickr extra data
						owner: photo.owner,
						//flickr url data
						id: photo.id,
						farm: photo.farm,
						secret: photo.secret,
						server: photo.server,
					});
					photos.pushObject(newPhotoItem);
				})
			});
		},
	}
});
