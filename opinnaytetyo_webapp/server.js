const http = require('http');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { exec } = require('child_process');
const { log } = require('console');

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Specify the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, 'image.png'); // Specify the filename
  }
});
const filePath = './uploads/image.png'
const upload = multer({ storage: storage });
let pointsData = []
// Variable to hold the image in memory
let storedImage = null;
const pythonScriptName = 'load_and_use_model.py'; // Change this to your script's path
//const scriptDirectory = 'path/to/python/loader/script';
const scriptDirectory = process.env.MODEL_LOAD_SCRIPT_DIR 
const public = "./public/"
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile(public+'html_file.html', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.write('Error loading file');
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
      }
    });
  } else if (req.url === '/html_script.js') {
    fs.readFile(public+'html_script.js', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.write('Error loading file');
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.write(data);
        res.end();
      }
    });
  } else if (req.url === '/html_canvas.js') {
    fs.readFile(public+'html_canvas.js', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.write('Error loading file');
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.write(data);
        res.end();
      }
    });
  } else if (req.url === '/loading.gif') {
    console.log("GIF LOADING")
    fs.readFile(public+'loading.gif', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.write('Error loading file');
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': 'image/gif' });
        res.write(data);
        res.end();
      }
    });}
    else if (req.url === '/camera_controls.js') {
      fs.readFile(public+'camera_controls.js', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.write('Error loading file');
          res.end();
        } else {
          res.writeHead(200, { 'Content-Type': 'application/javascript' });
          res.write(data);
          res.end();
        }
      });
  } else if (req.method === 'POST' && req.url === '/coordinates') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log("Received coordinates:", data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Coordinates received successfully' }));
      } catch (err) {
        console.error(err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid request' }));
      }
    });
  } else if (req.method === 'POST' && req.url === '/image') {
    // Use multer to handle the image upload
    fs.unlink(path.join(__dirname, 'uploads', 'image.png'), (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error deleting previous image:', unlinkErr);
      } else {
        console.log('Previous image deleted successfully.');
        setTimeout(() => {
          console.log('Waiting a bit', req.file);
          // Execute the Python script
        }, 1500);
      }
    })
    upload.single('image')(req, res, (err) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error uploading image' }));
        return;
      }
      console.log('Image received and saved:', req.file);
       // Execute the Python script
    })
    exec(`cd ${scriptDirectory} && python ${pythonScriptPath}`, (error, stdout, stderr) =>{
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Error executing script' }));
      return;
    }
    if (stderr) {
      console.error(`Script stderr: ${stderr}`);
    }
    console.log(`Script output: ${stdout}`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Image received and saved' }));
    })}
    else if (req.method === 'POST' && req.url === '/data') {
      // Use multer to handle the image upload
      console.log(req.data,req.body)
      upload.single('image')(req, res, (err) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Error uploading image' }));
          return;
        }
        storedImage = req.file; // Store the image in memory
        console.log('Image received and saved:', req.file.originalname);
                    // Get the points from the request body
        let points = req.body.points;
        if (points) {
            pointsData = JSON.parse(points).points; // Store points in the variable
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Image received and saved' }));
      });
    } else if (req.method === 'GET' && req.url === '/data') {
      if (storedImage) {
        console.log(storedImage)
        //console.log(storedImage.buffer)
        res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
        
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'No image found' }));
      }
    }
      else if (req.method === 'GET' && req.url === '/points') {
        if (pointsData) {
          //console.log(storedImage)
          //console.log(storedImage.buffer)
          const response = {points: pointsData }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(response));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'No image found' }));
        }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('404 Not Found');
    res.end();
  }
});

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
