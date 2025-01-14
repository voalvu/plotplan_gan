let canvas2 = document.getElementById('canvas2');
    let ctx2 = canvas2.getContext('2d');
    let drawing = false;
    let lastX, lastY;
    let lines = [];
    ctx2.fillStyle = 'white'; // Set the fill color to white
    ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
    ctx2.lineWidth = 5;
    ctx2.strokeStyle='red'
    // Load image onto canvas
    document.getElementById('imageLoader').addEventListener('change', (e) => {
        console.log(e)
        let image = new Image();
        console.log(image)
      image.onload = () => {
        ctx2.drawImage(image, 0, 0, canvas2.width, canvas2.height);
      };
      image.src = URL.createObjectURL(e.target.files[0]);
    });

    let canvas3 = document.getElementById('canvas3');
    let ctx3 = canvas3.getContext('2d');



    // Draw lines on canvas
canvas2.addEventListener('mousedown', (e) => {
    drawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
  
    // Start a new path when mouse is pressed down
    ctx2.beginPath();
    ctx2.moveTo(lastX, lastY);
  });
  
  canvas2.addEventListener('mousemove', (e) => {
    if (drawing) {
      let x = e.offsetX;
      let y = e.offsetY;
  
      // Draw a line to the new position
      ctx2.lineTo(x, y);
      ctx2.stroke(); // Apply the stroke
  
      // Update lastX and lastY
      lastX = x;
      lastY = y;
      //ctx2.closePath();
    }
  });
  
  // Stop drawing on mouse up
  canvas2.addEventListener('mouseup', () => {
    drawing = false;
  });
  
  // Stop drawing on mouse leave
  canvas2.addEventListener('mouseleave', () => {
    drawing = false;
  });
  

    // Send coordinates to server
    document.getElementById('sendCoordinates').addEventListener('click', () => {
      let coordinates = lines.map((line) => `${line.x1},${line.y1} ${line.x2},${line.y2}`);
      let data = coordinates.join(' ');
      // Send data to server using AJAX or fetch API
      fetch('/coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coordinates: data }),
      })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));

      console.log("Sending coordinates to the server")
      canvas2.toBlob((blob) => {
        const formData = new FormData();
        formData.append('image', blob);
    
        fetch('/image', {
          method: 'POST',
          body: formData,
        })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
      });
      
    });

    // Function to fetch existing data points
/*     function fetchData() {
        fetch('/data')
            .then(response => response.json())
            .then(data => {
                data.forEach((value, index) => {
                    myChart.data.labels.push(index + 1);
                    value.forEach((d,idx)=>{
                        //console.log(d,idx)
                    myChart.data.datasets[idx].data.push(d);
                    })
                });
                myChart.update();
            });

    } */
        // Function to check if a point is inside a polygon
function isPointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;  
  //console.log(polygon)
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      console.log(xi,yi,xj,yj)

      const intersect = ((yi > y) !== (yj > y)) &&
          (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }
  return inside;
}
let polygons = []

// Building height
const min = 2;
const max = 5;

let sideWidths = []

// Event listener for mouse clicks
canvas3.addEventListener('click', (event) => {
  const rect = canvas3.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;
  if (mouseX >= 0 && mouseX <= canvas.width && mouseY >= 0 && mouseY <= canvas.height) {
    console.log(polygons)
    polygons.forEach((polygon, index) => {
        if (isPointInPolygon([mouseX, mouseY], polygon)) {
          //console.log(polygon)

          if(polygon[1][1] - polygon[0][1] == 0){
            setSize(cuboid,(polygon[1][0] - polygon[0][0])/10, Math.random() * (max - min) + min, (polygon[2][1] - polygon[0][1])/10)
          }else if(polygon[1][0] - polygon[0][0] == 0){
            setSize(cuboid,(polygon[2][0] - polygon[0][0])/10, Math.random() * (max - min) + min, (polygon[2][1] - polygon[0][1])/10)
          }
          else{
            setSize(cuboid,(polygon[1][0] - polygon[0][0])/10, Math.random() * (max - min) + min, (polygon[1][1] - polygon[0][1])/10)
          }
            alert(`You clicked inside polygon ${index + 1} ${polygon}`);
            alert(sideWidths[index])
            alert(typeof(sideWidths[index]))
            alert(Math.max(...sideWidths[index]))
            document.getElementsByClassName("width_box")[0].dispatchEvent(new InputEvent('input',{composed:true,bubbles:true,inputType:"insertText",data:Math.max(...sideWidths[index])}))
            document.getElementsByClassName("height_box")[0].dispatchEvent(new InputEvent('input',{composed:true,bubbles:true,inputType:"insertText",data:Math.min(...sideWidths[index])}))
            cameraControls.fitToBox(cuboid,true, { paddingLeft: 1, paddingRight: 0 } )
        }
    });
}
});

canvas3.width = 400
canvas3.height = 400
const img = new Image();
img.onload = function() {
  // Calculate the width of the last fifth of the image
  const lastSixthWidth = img.width / 6;

  // Draw the last fifth of the image on the canvas
  canvas3.width = lastSixthWidth
  canvas3.height = lastSixthWidth
  ctx3.drawImage(img, img.width - lastSixthWidth, 0, lastSixthWidth, img.height, 0, 0, lastSixthWidth, img.height);
};

let fetchInterval; // Declare fetchInterval in the outer scope
let timeout; // Declare timeout in the outer scope

let first = true
let boundingBox = new THREE.Box3();
const canvasScalingFactor = 128/400
// Function to fetch existing data points
function fetchData() {
    fetch('/data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob(); // Get the response as a Blob
        })
        .then(imageBlob => {
            const imageUrl = URL.createObjectURL(imageBlob); // Create a URL for the image blob
            const imgElement = document.getElementById('resultImage') // Create an image element
            imgElement.src = imageUrl; // Set the source to the blob URL
            document.body.appendChild(imgElement); // Append the image to the body (or wherever you want)
            
            // for the 3rd canvas
            img.src =imageUrl
        })
        .catch(error => {
            console.error('Error fetching image:', error);
        });
    fetch('/points')
    .then(response => response.json())
    .then(data => {
        sideWidths = []
        polygons = []

        console.log(data)
        ctx3.strokeStyle="green"
        ctx3.lineWidth=4
        ctx3.beginPath()
        console.log(cuboid)
        setSize(cuboid,(data['points'][0][1][0] - data['points'][0][0][0])/10, 1, (data['points'][0][0][1] - data['points'][0][1][1])/10)
        //console.log(data['points'][0][1][0] - data['points'][0][0][0], 1, data['points'][0][0][1] - data['points'][0][1][1])
        //polygons = []
        console.log("LEN",data['points'].length)
        data['points'].forEach((value,index) =>{
          console.log(value)
          pi = 0
          // Rescale from canvas 400x400 to 128x128 to get correct meter
          sideWidths.push([])
          for(let p of value){
            if(pi == 4){break}
            // Rakennuksen sivun pituus
            sivPit = Math.sqrt((value[pi+1][0]*canvasScalingFactor - value[pi][0]*canvasScalingFactor)**2 + (value[pi+1][1]*canvasScalingFactor - value[pi][1]*canvasScalingFactor)**2)
            console.log(sivPit)
            sideWidths[index].push(sivPit)
            pi+=1
          }
          polygons.push(value)
          let g = new THREE.BoxGeometry((data['points'][index][1][0] - data['points'][index][0][0])/10, 1, (data['points'][index][0][1] - data['points'][index][1][1])/10)
          // Create a material
          // Create a mesh
          g.position = value[0][0],value[0][1]
          const c = new THREE.Mesh(g, material);
          //c.position = value[0][0],value[0][1]
          c.position.x = 10;
          c.position.y = 0;
          c.position.z = 10;
          scene.add(c);
          
          for(let p of value){
            ctx3.lineTo(p[0],p[1])
          }
          ctx3.stroke()
          //console.log(value[0][0],value[0][1],value[3][0]-value[0][0],value[3][1]-value[3][0])
        })
        console.log("complee")
    //clearInterval(fetchInterval);
    console.log("SIDE WIDTHS",sideWidths)
    
    });
    if (!first){
      clearInterval(fetchInterval);
      scene.traverse((object) => {
        console.log(object)
      if (object instanceof THREE.Mesh) {
          boundingBox.expandByObject(object);
      }
      });
    }
    first = false
    clearTimeout(timeout);
}
function setSize( myMesh, xSize, ySize, zSize){
  scaleFactorX = xSize ;// / myMesh.geometry.parameters.width;
  scaleFactorY = ySize ;// / myMesh.geometry.parameters.height;
  scaleFactorZ = zSize ;// / myMesh.geometry.parameters.depth;
  myMesh.scale.set( scaleFactorX, scaleFactorY, scaleFactorZ );
}
// Function to start fetching data periodically
function startFetching() {
    const loadingGif = document.getElementById('loadingGif'); // Get the loading GIF element
    const button = document.getElementById('sendCoordinates'); // Get the button by its ID
    loadingGif.style.display = 'block'; // Show the loading GIF

    timeout = setTimeout(() => {
        loadingGif.style.display = 'none'; // Hide the loading GIF
        alert('Timeout error: Fetching data took too long.'); // Show timeout error
        clearInterval(fetchInterval); // Stop the periodic fetching
    }, 45000); // 45 seconds timeout

    fetchInterval = setInterval(() => {
      fetchData();
      console.log("FETCHING")
    }, 5000); // Adjust the interval as needed
    // Fetch data every 5 seconds



    // Stop fetching when the button is pressed again
    button.addEventListener('click', () => {
        clearTimeout(timeout); // Clear the timeout if the button is pressed again
        clearInterval(fetchInterval); // Stop the periodic fetching
        loadingGif.style.display = 'none'; // Hide the loading GIF
    });
}


// Add event listener to the button to start fetching data
document.getElementById('sendCoordinates').addEventListener('click', startFetching);


const canvas4 = document.getElementById('canvas4');
const gl = canvas4.getContext('webgl');
// Create a scene
const scene = new THREE.Scene();

// Create a camera
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(400, 400);
document.getElementById('container').appendChild(renderer.domElement);

// Create a cuboid geometry
const geometry = new THREE.BoxGeometry(1, 3, 1);
// Create a material
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Create a mesh
const cuboid = new THREE.Mesh(geometry, material);
scene.add(cuboid);

// Render the scene
function animate() {
    requestAnimationFrame(animate);
    //cuboid.rotation.x = 0.5
    //cuboid.rotation.y += 0.006;
    renderer.render(scene, camera);
}
animate();
