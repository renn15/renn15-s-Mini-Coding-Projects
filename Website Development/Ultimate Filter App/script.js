var inputImage = null;
var outputImage = null;
var canvas = document.getElementById("canvas");
var stackInput = document.getElementById("stack");

function loadInputImage(file) {
  inputImage = new SimpleImage(file);
  inputImage.drawTo(canvas);
  outputImage = new SimpleImage(inputImage.getWidth(), inputImage.getHeight());
}

function copyImage(target, image) {
  for (var pixel of image.values()) {
    var x = pixel.getX();
    var y = pixel.getY();
    var copiedPixel = image.getPixel(x,y);
    target.setPixel(x,y,copiedPixel);
  }
  return target;
}

function grayscaleFilter(image) {
  for (var pixel of image.values()) {
        var gray = (pixel.getRed()+pixel.getGreen()+pixel.getBlue())/3;
        pixel.setRed(gray);
        pixel.setGreen(gray);
        pixel.setBlue(gray);
      }
      return image;
}

function redFilter(image) {
  for (var pixel of image.values()) {
    var average = (pixel.getRed()+pixel.getGreen()+pixel.getBlue())/3;
    if (average < 128) {
      pixel.setRed(average * 2);
      pixel.setGreen(0);
      pixel.setBlue(0);
    } else {
      pixel.setRed(255);
      pixel.setGreen(2 * average - 255);
      pixel.setBlue(2 * average - 255);
    }
  }
  return image;
}

function blurFilter(image) {
  var processedImage = new SimpleImage(image.getWidth(), image.getHeight());
  for (var pixel of image.values()) {
    var x = pixel.getX();
    var y = pixel.getY();
    var red = 0;
    var green = 0;
    var blue = 0;
    var rad = 1;
    if (x>rad && x<image.getWidth()-rad && y>rad && y<image.getHeight()-rad) {
      for (var i = -rad; i <= rad; i++) {
        for (var j = -rad; j <= rad; j++) {
          viewedPixel = image.getPixel(x+i,y+j);
          red += viewedPixel.getRed();
          green += viewedPixel.getGreen();
          blue += viewedPixel.getBlue();
        }
      }
      red /= 9;
      green /= 9;
      blue /= 9;
    } else {
      red = pixel.getRed();
      green = pixel.getGreen();
      blue = pixel.getBlue();
    }
    
    var targetPixel = processedImage.getPixel(x,y);
    targetPixel.setRed(red);
    targetPixel.setGreen(green);
    targetPixel.setBlue(blue);
  }
  return processedImage;
}

function rainbowFilter(image) {
  var height = image.getHeight();
  var division = height/7;
  for (var pixel of image.values()) {
    var y = pixel.getY();
    var redLow, greenLow, blueLow, redHigh, greenHigh, blueHigh;
    var average = (pixel.getRed()+pixel.getGreen()+pixel.getBlue())/3;
    
    if (y < division) {
      redLow = 2*average, greenLow = 0, blueLow = 0, redHigh = 255, greenHigh = 2*average-255, blueHigh = 2*average-255;
    } else if (y < 2*division) {
      redLow = 2*average, greenLow = 0.8*average, blueLow = 0, redHigh = 255, greenHigh = 1.2*average-51, blueHigh = 2*average-255;
    } else if (y < 3*division) {
      redLow = 2*average, greenLow = 2*average, blueLow = 0, redHigh = 255, greenHigh = 255, blueHigh = 2*average-255;
    } else if (y < 4*division) {
      redLow = 0, greenLow = 2*average, blueLow = 0, redHigh = 2*average-255, greenHigh = 255, blueHigh = 2*average-255;
    } else if (y < 5*division) {
      redLow = 0, greenLow = 0, blueLow = 2*average, redHigh = 2*average-255, greenHigh = 2*average-255, blueHigh = 255;
    } else if (y < 6*division) {
      redLow = 0.8*average, greenLow = 0, blueLow = 2*average, redHigh = 1.2*average-51, greenHigh = 2*average-255, blueHigh = 255;
    } else {
      redLow = 1.6*average, greenLow = 0, blueLow = 1.6*average, redHigh = 0.4*average+153, greenHigh = 2*average-255, blueHigh = 0.4*average+153;
    }
    
    if (average < 128) {
      pixel.setRed(redLow);
      pixel.setGreen(greenLow);
      pixel.setBlue(blueLow);
    } else {
      pixel.setRed(redHigh);
      pixel.setGreen(greenHigh);
      pixel.setBlue(blueHigh);
    }
  }
  return image;
}


function scatterFilter(image) {
  var processedImage = new SimpleImage(image.getWidth(), image.getHeight());
  for (var pixel of image.values()) {
    var x = pixel.getX();
    var y = pixel.getY();
    if (Math.random() < 0.5) { // Original pixel
      processedImage.setPixel(x, y, pixel);
    } else { // Scattered pixel, take nearby pixel
      var rad = 10;
      var xDist = Math.round(Math.random()*2*rad-rad);
      var yDist = Math.round(Math.random()*2*rad-rad); // Random integer from -rad to rad
      var copyX, copyY;
      
      if (x + xDist < 0) {
        copyX = 0;
      } else if (x + xDist >= image.getWidth()) {
        copyX = image.getWidth()-1;
      } else {
        copyX = x + xDist;
      }
  
      if (y + yDist < 0) {
        copyY = 0;
      } else if (y + yDist >= image.getHeight()) {
        copyY = image.getHeight()-1;
      } else {
        copyY = y + yDist;
      }
      
      var copyPixel = image.getPixel(copyX, copyY);
      processedImage.setPixel(x, y, copyPixel);
    }
  }
  return processedImage;
}

function applyFilter(type) {
  if (inputImage == null) {
    alert("No image has been uploaded yet!");
  } else {   
    var processedImage = new SimpleImage(inputImage.getWidth(),inputImage.getHeight());
    if (stackInput.checked == true){
      processedImage = copyImage(processedImage, outputImage);
    } else {
      processedImage = copyImage(processedImage, inputImage);
    }
    
    if (type == "grayscale") {
      outputImage = grayscaleFilter(processedImage);
    } else if (type == "red") {
      outputImage = redFilter(processedImage);
    } else if (type == "blur") {
      outputImage = blurFilter(processedImage);
    } else if (type == "rainbow") {
      outputImage = rainbowFilter(processedImage);
    } else if (type == "scatter") {
      outputImage = scatterFilter(processedImage);
    }
      outputImage.drawTo(canvas);
  }
}

function resetCanvas() {
  outputImage = inputImage;
  outputImage.drawTo(canvas);
}