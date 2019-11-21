const express = require('express');
const { to, ReE, ReS } = require('../services/util.service');

var multer = require('multer')
var fs = require('fs');
const fsExtra = require("fs-extra");
var url = require('url');
var path = require('path')

const imageDir = './uploads/';
var imageUrl = 'http://localhost:3001/v1/read/image/';

let fileNames = [];
var storage = multer.diskStorage({
  destination: function (req, file, cb) {    
    cb(null, imageDir)    
  },
  filename: function (req, file, cb) {    
    cb(null, Date.now() + '-' + path.extname(file.originalname))
    fileNames.push(Date.now() + '-' + path.extname(file.originalname));
  }
})
var upload = multer({ storage: storage }).array('file')

const uploadImage = async function(req, res) {
  fileNames = [];
  try {

    if (!fs.existsSync(imageDir))
      await fs.mkdirSync(imageDir)

    upload(req, res, err => {
      if (err) {
        return res.end("Error uploading file.");
      }
      res.json({
        fileNames: fileNames.map(item => {
          return imageUrl + item;
        })
      });
    })
  } catch (err) {
    res.status(500).send('Server Error');
  }
}
module.exports.uploadImage = uploadImage;

const readImage = async function(req, res) {
  pic = req.params.id
  fs.readFile(imageDir + pic, function (err, content) {
    if (err) {
      res.writeHead(400, { 'Content-type': 'text/html' })
      console.log(err);
      res.end("No such image");
    } else {
      //specify the content type in the response will be an image
      res.writeHead(200, { 'Content-type': 'image/jpg' });
      res.end(content);  
    }
  });
}
module.exports.readImage = readImage;
