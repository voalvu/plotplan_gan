c = document.getElementById("canvas")
console.log(c)

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scaleFactor = 100
const squareSize = 100
// Function to draw squares in a grid
function drawSquaresInGrid(rows, cols, scaleFactor= 100, HISSI_col = false, HISSI_row=false, CLAMP=1) {
    console.log(cols)
    
    const padding = 10; // Space between squares
    const offsetX = scaleFactor/5; // Offset for the larger rectangle
    const offsetY = scaleFactor/5; // Offset for the larger rectangle
    const largerRectWidth = cols*scaleFactor //+ ((cols - 1) * padding) + (2 * offsetX);
    const largerRectHeight = rows*scaleFactor//(rows * squareSize) + ((rows - 1) * padding) + (2 * offsetY);
    console.log(rows,cols)
    // Draw the larger rectangle
    ctx.fillStyle = '#D3D3D3'; // Light gray for the larger rectangle
    ctx.fillRect(0, 0, largerRectWidth, largerRectHeight*2);
    ctx.fillStyle = '#FFFFFF'; // Light gray for the larger rectangle
    ctx.fillRect(offsetX,offsetY, largerRectWidth-offsetX-offsetX, largerRectHeight*2-offsetY*2);
    const innerRectangleWidth = largerRectWidth-offsetX-offsetX
    const innerRectangleHeight = largerRectHeight - offsetY*2
    let rooms = Math.floor(innerRectangleWidth/(3*scaleFactor))
    console.log("rooms",rooms);
    
                                        // Käytävä  käytäväseinä  
    let room_pituus = innerRectangleHeight - 5 - 1.5
    ctx.fillStyle = '#005555';
    total_width_with_walls = offsetX
    
    console.log(total_width_with_walls)
    ctx.fillStyle = '#FF00AA';
    //console.log(rooms*offsetX+4*24*r+6*r)
    total_width_with_walls = innerRectangleWidth
    for(let r = 0; r<rooms; r++){
        //ctx.fillRect(offsetX+(3*scaleFactor*r),offsetY, 2.4*scaleFactor, room_pituus);
        total_width_with_walls-=(3*scaleFactor*r)
        console.log(total_width_with_walls)
    }
    console.log("roomrommo",(innerRectangleWidth -3*scaleFactor*rooms)/rooms)
    ctx.fillStyle = '#005555';
    console.log("hello",innerRectangleWidth, total_width_with_walls)
    //ctx.fillRect(offsetX+total_width_with_walls,offsetY, innerRectangleWidth -total_width_with_walls, room_pituus);
    console.log(innerRectangleWidth -total_width_with_walls, (innerRectangleWidth -total_width_with_walls)/rooms)
    //ctx.fillRect(offsetX,offsetY, 4*24, room_pituus);
    extra = (innerRectangleWidth-3*scaleFactor*rooms)/rooms
    console.log(extra)
    //ctx.fillRect(offsetX+4*24+6,offsetY, 4*24, room_pituus);
    ctx.fillStyle ='#00FF55'
    for(let r = 0; r<rooms; r++){
        ctx.fillStyle = getRandomColor()
        if(r <1){
            console.log("hello?")
            ctx.fillRect(offsetX+(3*scaleFactor*r),offsetY, 2.4*scaleFactor+offsetX+extra, room_pituus);
        }else{
            ctx.fillRect(offsetX+(3*scaleFactor*r)+extra,offsetY, 2.4*scaleFactor+extra, room_pituus);
        }
        //if (r > 0)total_width_with_walls+=offsetX+(3*scaleFactor*r)-2.4*scaleFactor
        console.log(r)
        //console.log(total_width_with_walls)
    }

    rappuset = false

    RAPPUSET_col = Math.floor(cols/2)+1
    RAPPUSET_row = 1
    // Draw the squares
    if (!HISSI_col)
        HISSI_col = Math.floor(cols/2)
    if (!HISSI_row)
        HISSI_row = 1

    alaNum = 0  



    /* for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            //console.log(col)
            if(col == 1 || col == cols-1){
                
            }
            else{
                if(CLAMP>1){
                    if(col%CLAMP==0){
                        ctx.fillStyle = getRandomColor();
                    }
                }
                else{
                    ctx.fillStyle = getRandomColor();
                }
            }


            // HISSIKUILU
            if(col==HISSI_col && row == HISSI_row){
                ctx.fillStyle = '#123456'
                const x = col * (squareSize + padding); // Calculate x position
                const y = row * (squareSize + padding) + offsetY + row*largerRectHeight - row*squareSize; // Calculate y position

        
                ctx.fillRect(x+2, y, squareSize, squareSize);
                ctx.fillStyle = '#456789'
                ctx.fillRect(x+5, y+3, squareSize-6, squareSize-6);
            }else{
            
            // PORTAAT
            if(col==RAPPUSET_col && row == RAPPUSET_row){
                ctx.fillStyle = '#999999'
                const x = col * (squareSize + padding); // Calculate x position
                const y = row * (squareSize + padding) + offsetX + row*largerRectHeight - row*squareSize;
                
                ctx.fillRect(x, y+padding, squareSize+padding, squareSize*2);
                ctx.fillStyle = '#FFFFFF'
                ctx.beginPath()
                for(let i = 20; i < padding*10; i+=padding){
                    ctx.moveTo(x,y+i);
                    ctx.lineTo(x+squareSize,y+i)
                    //console.log("doingit")
                }
                ctx.moveTo(x+squareSize/2,y+10)
                ctx.lineTo(x+squareSize/2,y+squareSize*2)
                ctx.stroke()
            }
            else{

                const x = col * (squareSize + padding) + offsetX; // Calculate x position
                const y = row * (squareSize + padding) + offsetY + row*largerRectHeight - row*squareSize; // Calculate y position

             // Filling the squares
             // Corners treated as special cases
             
             if(col == 1 || col == cols-1){
                // Handle merging "apartment" next to corner
                if(col==1){
                    // double the padding to merge another when CLAMP set to > 2
                    if(CLAMP>2){
                        ctx.fillRect(x-padding, y, squareSize+padding+padding, squareSize*2);
                        alaNum+=((squareSize+padding*2) * (squareSize*2))
                    }
                    else{
                        ctx.fillRect(x-padding, y, squareSize+padding, squareSize*2);
                        alaNum+=((squareSize+padding) * (squareSize*2))

                    }
                    
                    t = ctx.strokeStyle
                    ctx.strokeStyle = "black"
                    ctx.strokeRect(x-padding, y, squareSize+padding, squareSize*2)
                    ctx.strokeStyle = t
                }else{
                    if(row == 1)
                        ctx.fillRect(x-padding, y - offsetY, squareSize+padding, squareSize*2+offsetY);
                        alaNum+=((squareSize+padding) * (squareSize*2+offsetY))

                    if(row == 0)
                        ctx.fillRect(x-padding, y, squareSize+padding, squareSize*2 + offsetY,);
                        alaNum+=((squareSize+padding) * (squareSize*2+offsetY))
                }
            
                if(row == 0){
                    t = ctx.fillStyle
                    ctx.fillStyle = "black" 
                    ctx.fillText(`${col} ${alaNum}`,(squareSize+squareSize/5)*(col+1)-padding*3, col%2==0 ? 10 : 20);
                    
                    ctx.fillStyle = t
                }

                
             }else{
                if((col == 0 || col==cols-1) && row == 0){
                    // top row corners
                    ctx.fillRect(x, y, squareSize, squareSize*2+offsetY+offsetY*1.5);
                    t = ctx.strokeStyle
                    ctx.strokeStyle = "black"
                    ctx.strokeRect(x, y, squareSize, squareSize*2+offsetY+offsetY*1.5)
                    ctx.strokeStyle = t
                    alaNum+=((squareSize) * (squareSize*2+offsetY+offsetY*1.5))
                }
                if((col == 0 || col==cols-1) && row == 1){
                    // bottom row corners
                    ctx.fillRect(x, y-offsetY*1.5, squareSize, squareSize*2-offsetY*1.5);
                    t = ctx.strokeStyle
                    ctx.strokeStyle = "black"
                    ctx.strokeRect(x, y-offsetY*1.5, squareSize, squareSize*2-offsetY*1.5)
                    ctx.strokeStyle = t
                    alaNum+=((squareSize) * (squareSize*2-offsetY*1.5))
                }

                // Draw "normal" apartments
                if(CLAMP>2 && (col%CLAMP==0 || col%CLAMP==1)){
                    ctx.fillRect(x, y, squareSize+padding, squareSize*2);
                    alaNum+=((squareSize+padding) * (squareSize*2))
                }
                else
                    if(CLAMP>1 && col%CLAMP==0){
                        ctx.fillRect(x, y, squareSize + padding, squareSize*2);
                        alaNum+=((squareSize+padding- x) * (squareSize*2 - y))

                        // window panes
                        if(row==1)
                            //window pane bottom
                            ctx.strokeRect(x + squareSize,y+squareSize*2-1+offsetY, -50,-10)
                        else
                            //window pane top
                            ctx.strokeRect(x+padding,y-offsetY+5, 50,10)
                        
                        // doors
                        if (row==0 && col>0){
                            ctx.beginPath()
                            ctx.moveTo(x + squareSize,y+squareSize*2-1)
                            ctx.lineWidth=3
                            ctx.lineTo(x + squareSize - squareSize/2, y+squareSize*2-1)
                            
                            ctx.arc(x + squareSize - squareSize/2,y+squareSize*2-1,squareSize/2, Math.PI+Math.PI / 2,2*Math.PI,false)
                            ctx.stroke()
                            ctx.lineWidth=1
                        }else{                            if (row==1  && col<cols-1){
                                ctx.beginPath()
                                ctx.moveTo(x + squareSize+squareSize/2,y+1)
                                ctx.lineWidth=3
                                ctx.lineTo(x + squareSize - squareSize/2, y+1)
                                
                                ctx.arc(x + squareSize - squareSize/2, y+1,squareSize/2+2, Math.PI+Math.PI*-1 / 2,2*Math.PI,true)
                                ctx.stroke()
                                ctx.lineWidth=1
                            }
                        }
                    }
                    else{
                        ctx.fillRect(x, y, squareSize, squareSize*2);
                        alaNum+=((squareSize) * (squareSize*2))
                    }
                //alaNum = 0
                if(row == 0){
                    t = ctx.fillStyle
                    ctx.fillStyle = "black" 
                    ctx.fillText(`${col} ${alaNum}`,60*(col+1)-30, col%2==0 ? 10 : 20);
                    
                    ctx.fillStyle = t
                }
            }
            } // Draw the square
            alaNum = 0

        }
        alaNum = 0

    }
    alaNum = 0 


    }
    */
}

// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
default_height = 6
default_width = 12
// Draw a grid of 12 squares (6 columns, 2 rows) of size 50x50
drawSquaresInGrid(default_height, default_width, squareSize);

// INITIATILIZE SETTINGS UI ELEMENTS
let settings = document.getElementById("settings")
let width_box_title = document.createElement("p")
width_box_title.innerText = "Set width"
settings.appendChild(width_box_title)

let width_box = document.createElement('textarea')
width_box.classList.add("width_box")
width_box.innerText= "Set width here with number"
width_box.value = default_width

width_box.addEventListener('input',(e)=>{
    if (!e.isTrusted){
        width_box.value = e.data
    }
    //console.log(e)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(Number.isInteger(parseInt(width_box.value)) && parseInt(width_box.value) > 3){
        drawSquaresInGrid(height_box.value,width_box.value,squareSize, document.getElementById("hissiPos").value, document.getElementById("hissin puoli").value, document.getElementById("clampApartments").value)
        p = settings.getElementsByClassName('error')
        p[0].setAttribute('style',"display:None;")
    }else{
        p = settings.getElementsByClassName('error')
        p[0].setAttribute('style',"display:Visible;")
        //console.log('not an integer')
        //console.log(pp)
    }
})
settings.appendChild(width_box)

let height_box = document.createElement('textarea')
height_box.classList.add("height_box")
height_box.innerText= "Set height here with number"
height_box.value = default_height
height_box.addEventListener('input',(e)=>{
    if (!e.isTrusted){
        height_box.value = e.data
    }
    //console.log(e)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(Number.isInteger(parseInt(height_box.value)) && parseInt(height_box.value) > 3){
        drawSquaresInGrid(height_box.value,width_box.value,squareSize, document.getElementById("hissiPos").value, document.getElementById("hissin puoli").value, document.getElementById("clampApartments").value)
        p = settings.getElementsByClassName('error')
        p[0].setAttribute('style',"display:None;")
    }else{
        p = settings.getElementsByClassName('error')
        p[0].setAttribute('style',"display:Visible;")
        //console.log('not an integer')
        //console.log(pp)
    }
})
settings.appendChild(height_box)
// Create the slider
const width_slider = document.createElement('div');
width_slider.classList.add('slider');
width_slider.setAttribute('style', "position:absolute;top:100px;left:400px;width:30px;height:10px;background-color:red;");
// Create the steps
for (let steps = 0; steps < 20; steps += 1) {
    const st = document.createElement('div');
    st.classList.add('step');
    st.setAttribute("style", `background-color:black;position:absolute;top:2px;left:${10 * steps}px;width:10px;height:5px;`);
    width_slider.appendChild(st);
}

const ball = document.createElement('div');
ball.classList.add('step_ball');
ball.setAttribute("style", `background-color:green;border-radius: 25px;position:absolute;top:-2px;left:10px;width:15px;height:15px;`);
width_slider.appendChild(ball);

// Variable to track if the mouse is held down
let HELD = false;

// Add event listeners
width_slider.addEventListener("click", (e) => {
    console.log(e);
});

width_slider.addEventListener("mousedown", (e) => {
    HELD = true;
    
});

width_slider.addEventListener("mousemove",(e)=>{
    let ball= document.getElementsByClassName("step_ball")[0]    
    if(HELD){
            ball.style.left = `${e.x-400    -7}px`
        }
    }
)

width_slider.addEventListener("mouseup", (e) => {
    HELD = false;

    // Get the mouse position relative to the slider
    const mouseX = e.clientX - width_slider.getBoundingClientRect().left;

    // Calculate the closest step
    const steps = width_slider.getElementsByClassName('step');
    let closestStep = null;
    let closestDistance = Infinity;
    step_num = 0
    for (let i = 0; i < steps.length; i++) {
        const stepX = i * 10; // Each step is positioned at 10px intervals
        const distance = Math.abs(mouseX - stepX);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestStep = steps[i];
            step_num = i
        }
    }

    // Change the background color of the closest step to white
    if (closestStep) {
        //closestStep.style.backgroundColor = 'white';
        b = document.getElementsByClassName("step_ball") 
        console.log(b);
        b[0].style.left = closestStep.style.left
        document.getElementsByClassName("width_box")[0].dispatchEvent(new InputEvent('input',{composed:true,bubbles:true,inputType:"insertText",data:step_num}))
        {
}
        //setNativeValue(width_box[0], step_num)
        //width_box[0]
    }
});

/* RAPPUSET_col = Math.floor(cols/2)+1
RAPPUSET_row = 1
// Draw the squares
HISSI_col = Math.floor(cols/2)
HISSI_row = 1 */

settingGen = (label,top,left,el) => {
    hissi = document.createElement("input")
    hissi.setAttribute('inputType',"text")
    hissi.setAttribute('id',label)
    hissi.style.position="absolute";
    hissi.style.top=`${top}px`
    hissi.style.width="50px"
    hissi.style.left=`${left}px`
    hissi_l = document.createElement("label")
    hissi_l.setAttribute('for','hissi')
    hissi_l.innerText = label
    hissi_l.setAttribute('style',hissi.style.cssText)
    hissi_l.style.left = `${left-55}px`
    hissi.addEventListener("input",el)

    document.body.appendChild(hissi);
    document.body.appendChild(hissi_l);
}
settingGen("hissiPos",50,350,(e)=>{
    console.log("hissiPos")
    console.log(document.getElementById("hissiPos").value)
/*     if(document.getElementById("hissiPos").value) */
        drawSquaresInGrid(2,width_box.value,squareSize, e.target.value, document.getElementById("hissin puoli").value)
/*     else
        drawSquaresInGrid(2,width_box.value,50,HISSI_col=e.target.value) */
})
settingGen("hissin puoli",50,450,(e)=>{
    console.log(e)
    if(document.getElementById("hissin puoli").value)
        drawSquaresInGrid(2,width_box.value,squareSize, document.getElementById("hissiPos").value, HISSI_row=e.target.value)
    else
        drawSquaresInGrid(2,width_box.value,squareSize, HISSI_row=e.target.value)

})
settingGenClamp = (label, left, top, el) => {
    clampApartments = document.createElement("input")
    clampApartments.setAttribute('inputType',"text")
    clampApartments.setAttribute('id',label)
    clampApartments.style.position="absolute";
    clampApartments.style.top=`${top}px`
    clampApartments.style.width="50px"
    clampApartments.style.left=`${left}px`

    clampApartments_l = document.createElement("label")
    clampApartments_l.setAttribute('for','clampApartments')
    clampApartments_l.innerText = label
    clampApartments_l.setAttribute('style',hissi.style.cssText)
    clampApartments_l.style.top=`${top}px`
    clampApartments_l.style.left = `${left-100}px`

    clampApartments.addEventListener("input",el)

    document.body.appendChild(clampApartments);
    document.body.appendChild(clampApartments_l);
}
settingGenClamp("clampApartments", 500, 20, (e)=>{
    console.log(e)
    console.log(e.data)
    let CLAMP = e.data
    drawSquaresInGrid(2,width_box.value,squareSize,false, false,CLAMP)
})

settingSquareSize = (label, left, top, el) => {
    squareSizeSet = document.createElement("input")
    squareSizeSet.setAttribute('inputType',"text")
    squareSizeSet.setAttribute('id',label)
    squareSizeSet.style.position="absolute";
    squareSizeSet.style.top=`${top}px`
    squareSizeSet.style.width="50px"
    squareSizeSet.style.left=`${left}px`

    squareSize_l = document.createElement("label")
    squareSize_l.setAttribute('for','squareSize')
    squareSize_l.innerText = label
    squareSize_l.setAttribute('style',hissi.style.cssText)
    squareSize_l.style.top=`${top}px`
    squareSize_l.style.left = `${left-100}px`

    squareSizeSet.addEventListener("input",el)

    document.body.appendChild(squareSizeSet);
    document.body.appendChild(squareSize_l);
}
settingSquareSize("redraw?", 600, 60, (e)=>{
    console.log(e)
    console.log(e.data)
    let squareSizeSet = e.data
    drawSquaresInGrid(2,width_box.value,squareSizeSet,false, false,CLAMP)
})
/* hissi = document.createElement("input")
hissi.setAttribute('inputType',"text")
hissi.setAttribute('id','hissi')
rappuset = document.createElement("input")
rappuset.setAttribute('inputType',"text")
hissi.style.position="absolute";
hissi.style.top="50px"
hissi.style.width="50px"
hissi.style.left="350px"
hissi_l = document.createElement("label")
hissi_l.setAttribute('for','hissi')
hissi_l.innerText = "hissiPos"
hissi_l.setAttribute('style',hissi.style.cssText)
hissi_l.style.left = "295px"
hissi.addEventListener("input",(e)=>{
    console.log(e)
    drawSquaresInGrid(2,width_box.value,50,e.target.value)
})
document.body.appendChild(hissi);
document.body.appendChild(hissi_l); */
//document.body.appendChild(rappuset);

document.body.appendChild(width_slider);




// Append the slider to the body (or any other container)
document.body.appendChild(width_slider);
pp = document.createElement("p")
pp.classList.add("error")
pp.innerText ="Has to be a number larger than 3"
pp.setAttribute('style',"display:None;")
settings.appendChild(pp)
console.log(width_box)