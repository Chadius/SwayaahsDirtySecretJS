function loadImages() {
  // Create a list of all of the objects that must load images.
  objects_loading_images = [
    battlefield_web_render
  ];

  // Set up the graphics renderer.
  battlefield.renderer = battlefield_web_render;

  image_loading.objects_currently_loading_images_count = objects_loading_images.length;

  objects_loading_images.forEach(function(obj) {
    obj.loadRequiredImages();
  });
}

var image_loading = {
  objects_currently_loading_images_count: 0,
  loadRequiredImagesForObject: function(name_to_file_mapping, counting_object) {
    // Load images required by the game before showing anything to the user.
    // name_to_file_mapping is an array that contains nickname => filename mappings.
    // This will overwrite counting_object.finished_loading_required_images and counting_object.pending_required_images_count
    // This function returns an object that maps the nicknames supplied in name_to_file_mapping to image objects.
    name_to_images = {};

    counting_object.pending_required_images_count = name_to_file_mapping.length;
    name_to_file_mapping.forEach(function(nickname_filename){
      nickname = nickname_filename.varName;
      filename = nickname_filename.theFile;

      new_img = document.createElement("img");
      image_loading.beginLoadingImage(new_img, filename, counting_object);
      name_to_images[nickname] = new_img;
    });

    return name_to_images;
  },

  beginLoadingImage: function(img_object, filename, counting_object) {
    // Load the image, leaving a callback if it doesn't load properly.
    img_object.onload = () => {image_loading.decrementPendingImageCount(counting_object);}
    img_object.src = "images/" + filename;
  },

  decrementPendingImageCount: function(counting_object) {
    // A required image has loaded. Note this and set the complete variable to true if it's done.
    counting_object.pending_required_images_count --;
    if (counting_object.pending_required_images_count == 0) {
      // All of the pending images have finished loading.
      counting_object.finished_loading_images = true;
      image_loading.objectFinishedLoadingStartIfReady();
    }
  },

  objectFinishedLoadingStartIfReady: function () {
    // An object has finished loading all of its required images.
    image_loading.objects_currently_loading_images_count --;
    if (image_loading.objects_currently_loading_images_count == 0) {
      imageLoadingDoneSoStartGame();
    }
  }
}
