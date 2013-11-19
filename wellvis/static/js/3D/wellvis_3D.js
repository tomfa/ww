













//######################################################################################################################################
//###################################################################################################################################### #
//#############        #####          ##############        ###          ####  ######  ###        ####        #######        ########### ##
//###################   ######  ####   ############   #############  ########  ######  ###  ##########  ############   ################# ##
//#################   ########  ####   #############        #######  ########  ######  ###       #####       ########        ########### ##
//############  #####   ######  ###   ###################   #######  #########  ####  ####  ##########  ###################  ########### ##
//#############        #####         ##############        ########  ##########      #####  ##########  #############       ############ ##
//###################################################################################################################################### #
//######################################################################################################################################


//==|| The Vector3
function v(x,y,z) { 
  return new THREE.Vector3(x,y,z); 
}


//==|| Change the Color of the scene (whole 3D module)
function changeSceneColor(color) {  
  WELLVIS.theScene.fog = new THREE.FogExp2( color, 0 );
  WELLVIS.theRenderer.setClearColor( WELLVIS.theScene.fog.color, 1 );
  WELLVIS.theSceneColor = color;
  colorTrace("The Scene color is changed to" + color, "Blue");
}



//==|| Add Track ball controls
function addTrackballControls() {
  WELLVIS.theControls = new THREE.TrackballControls(WELLVIS.theCamera, WELLVIS.theCameraTarget,  WELLVIS.theRenderer.domElement);

  WELLVIS.theControls.rotateSpeed = 3.0;
  WELLVIS.theControls.zoomSpeed = 2;
  WELLVIS.theControls.panSpeed = 1;

  WELLVIS.theControls.noZoom = false;
  WELLVIS.theControls.noPan = false;

  WELLVIS.theControls.staticMoving = true;
  WELLVIS.theControls.dynamicDampingFactor = 0.3;  //==|| Control the speed of drag rotation

  var radius = 24; // scalar value used to determine relative zoom distances

  WELLVIS.theControls.minDistance = radius * 0.1;  //==|| Min zoom out distance
  WELLVIS.theControls.maxDistance = radius * 5235;   //==|| Max zoom out distance


  WELLVIS.theControls.keys = [ 65, 83, 68 ];

  WELLVIS.theControls.addEventListener( 'change', render );

} 



//==|| When the browser window gets resized
function onWindowResize() {
  colorTrace("On Window Resize", "Blue");


    theScreenWidth = window.innerWidth;
    theScreenHeight = window.innerHeight;

    WELLVIS.theHeight   = theScreenHeight - 60 - 100; 

    if(WELLVIS.leftPanelIsVisible){
      WELLVIS.theWidth  = theScreenWidth - 446 - 8;       
    }
    else {
      WELLVIS.theWidth  = theScreenWidth - 8;
    }

    $("#thePathsDetailContainer").css({"height" : WELLVIS.theHeight + 2 - 45});
    $("#theConfigurationPanel").css({"height": WELLVIS.theHeight + 2 - 45});

    $("#theContainer").css({"width" :  WELLVIS.theWidth});
    $("#theContainer").css({"height" :  WELLVIS.theHeight});


  WELLVIS.theCamera.aspect = WELLVIS.theWidth / WELLVIS.theHeight;
  WELLVIS.theCamera.updateProjectionMatrix();

  WELLVIS.theRenderer.setSize( WELLVIS.theWidth, WELLVIS.theHeight );

  WELLVIS.theControls.handleResize();

  render();

}



function animate() {
  requestAnimationFrame( animate );
  WELLVIS.theControls.update();
}



function render() {
  WELLVIS.theRenderer.render( WELLVIS.theScene, WELLVIS.theCamera );
}


function createTextCanvas(text, color, font, size) {
    size = size || 24;
    var canvas = document.createElement('canvas');
    
    var ctx = canvas.getContext('2d');
    
    var fontStr = (size + 'px ') + (font || 'Arial');
    ctx.font = fontStr;
    
    var w = ctx.measureText(text).width;
    var h = Math.ceil(size);
    
    canvas.width = w;
    canvas.height = h;
    
    ctx.font = fontStr;
    ctx.fillStyle = color || 'black';
    ctx.fillText(text, 0, Math.ceil(size*0.8));
    
    return canvas;
}

function createText2D(text, color, font, size, theLabelOpacity, segW, segH) {
    var canvas = createTextCanvas(text, color, font, size);
    var plane = new THREE.PlaneGeometry(canvas.width, canvas.height, segW, segH);
    
    var tex = new THREE.Texture(canvas);
    tex.needsUpdate = true;

    var planeMat = new THREE.MeshBasicMaterial({
        map: tex, 
        color: 0xffffff, 
        transparent: true, 
        side: THREE.DoubleSide,
        opacity: theLabelOpacity
    });

    var mesh = new THREE.Mesh(plane, planeMat);
    mesh.scale.set(0.25, 0.25, 0.25);
    mesh.doubleSided = true;
    return mesh;
}



//==|| Check if the current point fall under the current Axes plane ranges
//==|| if not adjust the ranges again and redraw the Axes planes again
function checkRangesForPlanes(x, y, z) {

  var redraw = false;

  if(x > WELLVIS.maxX) { 
    WELLVIS.maxX = parseInt(x / WELLVIS.theUnit) * WELLVIS.theUnit + WELLVIS.theUnit;
    redraw = true;
  }

  if(x < WELLVIS.minX) {
    WELLVIS.minX = parseInt(x / WELLVIS.theUnit) * WELLVIS.theUnit - WELLVIS.theUnit;
    redraw = true;
  }

  if(y > WELLVIS.maxY) {
    WELLVIS.maxY =parseInt(y / WELLVIS.theUnit) * WELLVIS.theUnit + WELLVIS.theUnit;
    redraw = true;
  }

  if(y < WELLVIS.minY) {
    WELLVIS.minY = parseInt(y / WELLVIS.theUnit) * WELLVIS.theUnit - WELLVIS.theUnit;
    redraw = true;
  }

  if(z > WELLVIS.theZ) {
    WELLVIS.theZ = parseInt(z / WELLVIS.theUnit) * WELLVIS.theUnit + WELLVIS.theUnit;
    redraw = true;
  }


  if(redraw) {
    redrawAxesPlanes();
  }


}






//==|| Redraw the Axes plane
function redrawAxesPlanes() {

  //==|| Empty YZ Plane first
  emptyYZ_Plane();
    //==|| Redrawing the YZ Plane
  drawYZ_Plane();



  //==|| Empty XZ Plane first
  emptyXZ_Plane();
  //==|| Redrawing the XZ Plane
  drawXZ_Plane();



  //==|| Empty XY Plane first
  emptyXY_Plane();
  //==|| Redrawing the XY Plane
  drawXY_Plane(); 



  //==|| remove the previous North Arrow 
  WELLVIS.theMainObject.remove(WELLVIS.theArrowNorth);

  //==|| Now redraw the North Arrow
  drawArrowNorth();



}

//==|| Remove everything from YZ Plane
function emptyYZ_Plane() {
    //==|| Removing the outlines and grids of YZ Plane
    WELLVIS.theYZ_Plane.remove(WELLVIS.theYZ_PlaneOutline);
    WELLVIS.theYZ_Plane.remove(WELLVIS.theYZ_PlaneGrids);

    //==|| Removing the grid line and the axis line from the plane grids
    WELLVIS.theYZ_PlaneGrids.remove(WELLVIS.theYZ_PlaneGridLines);            
  WELLVIS.theYZ_PlaneGrids.remove(WELLVIS.theYZ_PlaneAxisLine);

}

//==|| Remove everything from XZ Plane
function emptyXZ_Plane() {
    //==|| Removing the outline and the grids of XZ Plane
    WELLVIS.theXZ_Plane.remove(WELLVIS.theXZ_PlaneOutline);
    WELLVIS.theXZ_Plane.remove(WELLVIS.theXZ_PlaneGrids);

  //==|| Removing the grid line and the axis line from the plane grids
    WELLVIS.theXZ_PlaneGrids.remove(WELLVIS.theXZ_PlaneGridLines);            
    WELLVIS.theXZ_PlaneGrids.remove(WELLVIS.theXZ_PlaneAxisLine);

    //==|| Removing the labels
  WELLVIS.theXZ_Plane.remove(WELLVIS.theXZ_PlaneLabels);

  //==|| Remove all the children of theXZ_PlaneLabels
  for ( var i = WELLVIS.theXZ_PlaneLabels.children.length - 1; i >= 0 ; i-- ) {
      WELLVIS.theXZ_PlaneLabels.remove(WELLVIS.theXZ_PlaneLabels.children[ i ]);
  }

}

//==|| Remove everything from XY Plane
function emptyXY_Plane() {
    //==|| Removing the Outline and the grids of XY Plane
    WELLVIS.theXY_Plane.remove(WELLVIS.theXY_PlaneOutline);
    WELLVIS.theXY_Plane.remove(WELLVIS.theXY_PlaneGrids);

    //==|| Removing the grid line and the axis line from the plane grids
    WELLVIS.theXY_PlaneGrids.remove(WELLVIS.theXY_PlaneGridLines);            
    WELLVIS.theXY_PlaneGrids.remove(WELLVIS.theXY_PlaneAxisLine);


  //==|| Removing the labels from XY Plane
    WELLVIS.theXY_Plane.remove(WELLVIS.theXY_PlaneLabels);

    
    //==|| Remove all the children of theXY_PlaneLabels
  for ( var i = WELLVIS.theXY_PlaneLabels.children.length - 1; i >= 0 ; i-- ) {
      WELLVIS.theXY_PlaneLabels.remove(WELLVIS.theXY_PlaneLabels.children[ i ]);
  }

}




//================================================
//==|| Add a new line to the entire well Path
//================================================
function addWellPath(x, y, z) {
  
  var newPoint = v(x,y,z);

  //==|| The New Line material
    var theNewLineMaterial = new THREE.LineBasicMaterial( {
        transparent: true,
        color: WELLVIS.theWellLineColor,
        opacity: WELLVIS.theWellLineOpacity, 
        lineWidth: 1
      }
    );


  //==|| The New Line Geometry
    var theNewLineGeo = new THREE.Geometry();
    theNewLineGeo.vertices.push(
      WELLVIS.thePreviousPoint, newPoint
    );


    //==|| The New Line
    var theNewLine = new THREE.Line(theNewLineGeo, theNewLineMaterial);
    theNewLine.type = THREE.Lines;


  //==|| Add the line to the list of wellPath Lines
  WELLVIS.theWellPathArray.push(new TheLine(WELLVIS.thePreviousPoint, newPoint, WELLVIS.theWellLineColor, 1, WELLVIS.theWellLineOpacity) );

    //==|| Add the new line to the Well Path object in the scene
  WELLVIS.theWellPath.add(theNewLine);

  //==|| Keeping the list
  WELLVIS.theWellPathList.push(theNewLine);

  //==|| Now new point becomes the previous point
  WELLVIS.thePreviousPoint = newPoint;




}


//==|| Redraw the well path
//==|| changedFeatures  is a boolean that represent if the well should be drawn with the new properties or simply from it's JSON object
function redrawWellPath(changedFeatures) {



  //==|| First of all lets remove the current well path
  WELLVIS.theMainObject.remove(WELLVIS.theWellPath);

  //==|| Empty the well path object3D
  $.each(WELLVIS.theWellPathList, function(index){
    //colorTrace("object is "+ theObject, "Green");
    WELLVIS.theWellPath.remove(WELLVIS.theWellPathList[index]);
  });


  //==|| empty the well path list
  WELLVIS.theWellPathList.length = 0;



  var data = WELLVIS.theWellPathArray;
  
  $.each(data, function(index){

    var theStartPoint   = data[index].theStartPoint;
    var theEndPoint   = data[index].theEndPoint;
    var theColor    = data[index].theColor;
    var theLineWidth  = data[index].theLineWidth;
    var theLineOpacity  = data[index].theLineOpacity;

    //==|| The Well Line must have the new Colors SO
    if(changedFeatures) {
      theColor = WELLVIS.theWellLineColor;
      theLineOpacity = WELLVIS.theWellLineOpacity;
    }

    var theNewLineMaterial = new THREE.LineBasicMaterial( {
        transparent: true,
        opacity: theLineOpacity,
            color: theColor, 
            lineWidth: 1
          }
        );


    //==|| The New Line Geometry
        var theNewLineGeo = new THREE.Geometry();
        theNewLineGeo.vertices.push(
          theStartPoint, theEndPoint
        );


        //==|| The New Line
        var theNewLine = new THREE.Line(theNewLineGeo, theNewLineMaterial);
        theNewLine.type = THREE.Lines;

        //==|| Add the new line to the Well Path object in the scene
    WELLVIS.theWellPath.add(theNewLine);

    //==|| Pushing in the New lines in the well path
    WELLVIS.theWellPathList.push(theNewLine);

  });


    //==||Let's add the well path back to the main object
  WELLVIS.theMainObject.add(WELLVIS.theWellPath);

  //==|| Let's render the changes
  render();

}



//==|| Display all three Axes planes and the North Arrow
function addAxesPlanes() {

  //==|| Draw the Three Planes
  drawYZ_Plane();
  drawXZ_Plane();
  drawXY_Plane();

  //==|| Draw the arrow pointing to the North
  drawArrowNorth();


  

  //==|| Add the well path in the main object
  WELLVIS.theMainObject.add(WELLVIS.theWellPath);

  //==|| Add the main object to the Scene
  WELLVIS.theScene.add(WELLVIS.theMainObject);

}




function drawYZ_Plane() {

    //==|| The X Plane

  //==|| The Outline Material
    WELLVIS.theYZ_PlaneOutlineMaterial = new THREE.LineBasicMaterial( {
        color: WELLVIS.theYZ_PlaneOutlineMaterialColor, 
        lineWidth: WELLVIS.theYZ_PlaneOutlineMaterialLineWidth,
        transparent: true,
        opacity: WELLVIS.theYZ_PlaneOutlineMaterialLineOpacity
      }
    );

    //==|| The Gridline Material
  WELLVIS.theYZ_PlaneGridLinesMaterial = new THREE.LineBasicMaterial( {
        color: WELLVIS.theYZ_PlaneGridLinesMaterialColor, 
        lineWidth: WELLVIS.theYZ_PlaneGridLinesMaterialLineWidth,
        transparent: true,
        opacity: WELLVIS.theYZ_PlaneGridLinesMaterialLineOpacity
      }
    );

  //==|| the AxisLine Material
  WELLVIS.theYZ_PlaneAxisLineMaterial = new THREE.LineBasicMaterial( {
        color: WELLVIS.theYZ_PlaneAxisLineMaterialColor, 
        lineWidth: WELLVIS.theYZ_PlaneAxisLineMaterialLineWidth,
        transparent: true,
        opacity: WELLVIS.theYZ_PlaneAxisLineMaterialLineOpacity
      }
    );


  //==|| the Outline Geometry
    WELLVIS.theYZ_PlaneOutlineGeo = new THREE.Geometry();
    WELLVIS.theYZ_PlaneOutlineGeo.vertices.push(

      v(WELLVIS.maxX, WELLVIS.minY, 0), v(WELLVIS.maxX, WELLVIS.maxY, 0),
      v(WELLVIS.maxX, WELLVIS.maxY, 0), v(WELLVIS.maxX, WELLVIS.maxY, WELLVIS.theZ),
      v(WELLVIS.maxX, WELLVIS.maxY, WELLVIS.theZ), v(WELLVIS.maxX, WELLVIS.minY, WELLVIS.theZ),
      v(WELLVIS.maxX, WELLVIS.minY, WELLVIS.theZ), v(WELLVIS.maxX, WELLVIS.minY, 0)


    );


    //==|| the Outline
    WELLVIS.theYZ_PlaneOutline = new THREE.Line(WELLVIS.theYZ_PlaneOutlineGeo, WELLVIS.theYZ_PlaneOutlineMaterial);
    WELLVIS.theYZ_PlaneOutline.type = THREE.Lines;



    //==|| Checking how many grids are there in width, lenght and height
    var noOfGridsInLength = ((-1 * WELLVIS.minY) + WELLVIS.maxY) / WELLVIS.theUnit;
    var noOfGridsInHeight = (WELLVIS.theZ / WELLVIS.theUnit)

    //==|| The Gridlines Geometry
  WELLVIS.theYZ_PlaneGridLinesGeo = new THREE.Geometry();

    //==|| If more than 2 grids we need to draw additional lines
    //if(noOfGridsInLength > 1){
    //==|| Across the length              
        for(var value = (WELLVIS.minY + WELLVIS.theUnit); value <= (WELLVIS.maxY - WELLVIS.theUnit); value += WELLVIS.theUnit) {
          if(value != 0) {
            WELLVIS.theYZ_PlaneGridLinesGeo.vertices.push(
              v(WELLVIS.maxX, value, 0), v(WELLVIS.maxX, value, WELLVIS.theZ)
            );
          } 
        }
   // }

  //==|| If more than 2 grids we need to draw additional lines
    //if(noOfGridsInHeight > 1){  
    //==|| Across the height            
        for(var value = (WELLVIS.theUnit); value <= (WELLVIS.theZ - WELLVIS.theUnit); value += WELLVIS.theUnit) {
        WELLVIS.theYZ_PlaneGridLinesGeo.vertices.push(
          v(WELLVIS.maxX, WELLVIS.minY, value), v(WELLVIS.maxX, WELLVIS.maxY, value)
        );                
        }
    //  }


    //==|| the Gridlines
    WELLVIS.theYZ_PlaneGridLines = new THREE.Line(WELLVIS.theYZ_PlaneGridLinesGeo, WELLVIS.theYZ_PlaneGridLinesMaterial);
    WELLVIS.theYZ_PlaneGridLines.type = THREE.Lines;

    //==|| The AxisLine Geometry
  WELLVIS.theYZ_PlaneAxisLineGeo = new THREE.Geometry();
    WELLVIS.theYZ_PlaneAxisLineGeo.vertices.push(
      v(WELLVIS.maxX, 0, 0), v(WELLVIS.maxX, 0, WELLVIS.theZ)
    );

    //==|| The AxisLine
    WELLVIS.theYZ_PlaneAxisLine = new THREE.Line(WELLVIS.theYZ_PlaneAxisLineGeo, WELLVIS.theYZ_PlaneAxisLineMaterial);
    WELLVIS.theYZ_PlaneAxisLine.type = THREE.Lines;


    //==|| Adding axis line to the Plane Grids object   
    WELLVIS.theYZ_PlaneGrids.add(WELLVIS.theYZ_PlaneGridLines);           
    WELLVIS.theYZ_PlaneGrids.add(WELLVIS.theYZ_PlaneAxisLine);

    //==|| Adding different lines in the X-Plane  
    WELLVIS.theYZ_Plane.add(WELLVIS.theYZ_PlaneOutline);
    WELLVIS.theYZ_Plane.add(WELLVIS.theYZ_PlaneGrids);

    //==|| Adding the X-Plane to the MainObject
    WELLVIS.theMainObject.add(WELLVIS.theYZ_Plane);

}



function drawXZ_Plane() {

    //==|| The Y Plane

 

  //==|| The Outline Material
    WELLVIS.theXZ_PlaneOutlineMaterial = new THREE.LineBasicMaterial( {
        color         : WELLVIS.theXZ_PlaneOutlineMaterialColor, 
        lineWidth     : WELLVIS.theXZ_PlaneOutlineMaterialLineWidth,
        transparent   : true,
        opacity       : WELLVIS.theXZ_PlaneOutlineMaterialLineOpacity
      }
    );

    //==|| The Gridline Material
  WELLVIS.theXZ_PlaneGridLinesMaterial = new THREE.LineBasicMaterial( {
        color         : WELLVIS.theXZ_PlaneGridLinesMaterialColor, 
        lineWidth     : WELLVIS.theXZ_PlaneGridLinesMaterialLineWidth,
        transparent   : true,
        opacity       : WELLVIS.theXZ_PlaneGridLinesMaterialLineOpacity
      }
    );

  //==|| the AxisLine Material
  WELLVIS.theXZ_PlaneAxisLineMaterial = new THREE.LineBasicMaterial( {
        color         : WELLVIS.theXZ_PlaneAxisLineMaterialColor, 
        lineWidth     : WELLVIS.theXZ_PlaneAxisLineMaterialLineWidth,
        transparent   : true,
        opacity       : WELLVIS.theXZ_PlaneAxisLineMaterialLineOpacity
      }
    );


  //==|| The Outline Geometry
    WELLVIS.theXZ_PlaneOutlineGeo = new THREE.Geometry();
    WELLVIS.theXZ_PlaneOutlineGeo.vertices.push(

      v(WELLVIS.maxX, WELLVIS.minY, 0),             v(WELLVIS.maxX, WELLVIS.minY, WELLVIS.theZ),
      v(WELLVIS.maxX, WELLVIS.minY, WELLVIS.theZ),  v(WELLVIS.minX, WELLVIS.minY, WELLVIS.theZ),
      v(WELLVIS.minX, WELLVIS.minY, WELLVIS.theZ),  v(WELLVIS.minX, WELLVIS.minY, 0),
      v(WELLVIS.minX, WELLVIS.minY, 0),             v(WELLVIS.maxX, WELLVIS.minY, 0)


    );

    //==|| The Outline
    WELLVIS.theXZ_PlaneOutline = new THREE.Line(WELLVIS.theXZ_PlaneOutlineGeo, WELLVIS.theXZ_PlaneOutlineMaterial);
    WELLVIS.theXZ_PlaneOutline.type = THREE.Lines;

    


    //==|| Checking how many grids are there in width, lenght and height
    var noOfGridsInBreadth = ((-1 * WELLVIS.minX) + WELLVIS.maxX) / WELLVIS.theUnit;
    var noOfGridsInHeight = (WELLVIS.theZ / WELLVIS.theUnit)

    //==|| The Gridlines Geometry
  WELLVIS.theXZ_PlaneGridLinesGeo = new THREE.Geometry();

    //==|| If more than 2 grids we need to draw additional lines
    //if(noOfGridsInBreadth > 1){             
        for(var value = (WELLVIS.minX + WELLVIS.theUnit); value <= (WELLVIS.maxX - WELLVIS.theUnit); value += WELLVIS.theUnit) {
          if(value != 0) {
            WELLVIS.theXZ_PlaneGridLinesGeo.vertices.push(
              v(value, WELLVIS.minY, 0), v(value, WELLVIS.minY, WELLVIS.theZ)
            );
          } 
        }
   // }

  //==|| If more than 2 grids we need to draw additional lines
  //  if(noOfGridsInHeight > 1){              
        for(var value = 0; value <= WELLVIS.theZ; value += WELLVIS.theUnit) {
          if(value > 0 && value < WELLVIS.theZ){
            WELLVIS.theXZ_PlaneGridLinesGeo.vertices.push(
              v(WELLVIS.minX, WELLVIS.minY, value), v(WELLVIS.maxX, WELLVIS.minY, value)
            );
          }

        var gridValue = createText2D(value + '', WELLVIS.theLabelColor, WELLVIS.theLabelFont, WELLVIS.theLabelFontSize, WELLVIS.theLabelOpacity);
        gridValue.position.x = WELLVIS.minX -   WELLVIS.theLabelMargin;
        gridValue.position.y = WELLVIS.minY;
        gridValue.position.z = value;


          //==|| Rotating the text/label/value to level it with the Y-Plane
          //  gridValue.rotation.set(Math.PI, Math.PI/2, 0);

      gridValue.rotation.set(Math.PI/2, Math.PI, Math.PI);


          WELLVIS.theXZ_PlaneLabels.add(gridValue);

        }
   // }




    //==|| the Gridlines
    WELLVIS.theXZ_PlaneGridLines = new THREE.Line(WELLVIS.theXZ_PlaneGridLinesGeo, WELLVIS.theXZ_PlaneGridLinesMaterial);
    WELLVIS.theXZ_PlaneGridLines.type = THREE.Lines;

    //==|| The AxisLine Geometry
  WELLVIS.theXZ_PlaneAxisLineGeo = new THREE.Geometry();
    WELLVIS.theXZ_PlaneAxisLineGeo.vertices.push(
      v(0, WELLVIS.minY, 0), v(0, WELLVIS.minY, WELLVIS.theZ)
    );

    //==|| The AxisLine
    WELLVIS.theXZ_PlaneAxisLine = new THREE.Line(WELLVIS.theXZ_PlaneAxisLineGeo, WELLVIS.theXZ_PlaneAxisLineMaterial);
    WELLVIS.theXZ_PlaneAxisLine.type = THREE.Lines;




    //==|| Adding axis line to the Plane Grids object   
    WELLVIS.theXZ_PlaneGrids.add(WELLVIS.theXZ_PlaneGridLines);           
    WELLVIS.theXZ_PlaneGrids.add(WELLVIS.theXZ_PlaneAxisLine);

    //==|| Adding different lines in the Y-Plane
    WELLVIS.theXZ_Plane.add(WELLVIS.theXZ_PlaneOutline);
    WELLVIS.theXZ_Plane.add(WELLVIS.theXZ_PlaneGrids);


    //==|| Adding the labels/values in the Y-Plane
  WELLVIS.theXZ_Plane.add(WELLVIS.theXZ_PlaneLabels);

  //==|| Adding the X-Plane to the MainObject
    WELLVIS.theMainObject.add(WELLVIS.theXZ_Plane);

}



function drawXY_Plane() {

  //==|| The Outline Material
    WELLVIS.theXY_PlaneOutlineMaterial = new THREE.LineBasicMaterial( {
        color: WELLVIS.theXY_PlaneOutlineMaterialColor, 
        lineWidth: WELLVIS.theXY_PlaneOutlineMaterialLineWidth,
        transparent: true,
        opacity: WELLVIS.theXY_PlaneOutlineMaterialLineOpacity
      }
    );

    //==|| The Gridline Material
  WELLVIS.theXY_PlaneGridLinesMaterial = new THREE.LineBasicMaterial( {
        color: WELLVIS.theXY_PlaneGridLinesMaterialColor, 
        lineWidth: WELLVIS.theXY_PlaneGridLinesMaterialLineWidth,
        transparent: true,
        opacity: WELLVIS.theXY_PlaneGridLinesMaterialLineOpacity
      }
    );

  //==|| the AxisLine Material
  WELLVIS.theXY_PlaneAxisLineMaterial = new THREE.LineBasicMaterial( {
        color: WELLVIS.theXY_PlaneAxisLineMaterialColor, 
        lineWidth: WELLVIS.theXY_PlaneAxisLineMaterialLineWidth,
        transparent: true,
        opacity: WELLVIS.theXY_PlaneAxisLineMaterialLineOpacity
      }
    );


  //==|| The Outline Geometry
    WELLVIS.theXY_PlaneOutlineGeo = new THREE.Geometry();
    WELLVIS.theXY_PlaneOutlineGeo.vertices.push(

      v(WELLVIS.maxX, WELLVIS.minY, WELLVIS.theZ), v(WELLVIS.maxX, WELLVIS.maxY, WELLVIS.theZ),
      v(WELLVIS.maxX, WELLVIS.maxY, WELLVIS.theZ), v(WELLVIS.minX, WELLVIS.maxY, WELLVIS.theZ),
      v(WELLVIS.minX, WELLVIS.maxY, WELLVIS.theZ), v(WELLVIS.minX, WELLVIS.minY, WELLVIS.theZ),
      v(WELLVIS.minX, WELLVIS.minY, WELLVIS.theZ), v(WELLVIS.maxX, WELLVIS.minY, WELLVIS.theZ)


    );

    //==|| The Outline
    WELLVIS.theXY_PlaneOutline = new THREE.Line(WELLVIS.theXY_PlaneOutlineGeo, WELLVIS.theXY_PlaneOutlineMaterial);
    WELLVIS.theXY_PlaneOutline.type = THREE.Lines;






    //==|| Checking how many grids are there in width, lenght and height
    var noOfGridsInBreadth = ((-1 * WELLVIS.minX) + WELLVIS.maxX) / WELLVIS.theUnit;
    var noOfGridsInLength = ((-1 * WELLVIS.minY) + WELLVIS.maxY) / WELLVIS.theUnit;

    //==|| The Gridlines Geometry
  WELLVIS.theXY_PlaneGridLinesGeo = new THREE.Geometry();

    //==|| If more than 2 grids we need to draw additional lines
    //if(noOfGridsInBreadth > 1){             
        for(var value = (WELLVIS.minX ); value <= (WELLVIS.maxX); value += WELLVIS.theUnit) {
          if(value > WELLVIS.minX && value < WELLVIS.maxX) {          
            if(value != 0) {
              WELLVIS.theXY_PlaneGridLinesGeo.vertices.push(
                v(value, WELLVIS.minY, WELLVIS.theZ), v(value, WELLVIS.maxY, WELLVIS.theZ)
              );
            }
          }

          var gridValue = createText2D(value + '', WELLVIS.theLabelColor, WELLVIS.theLabelFont, WELLVIS.theLabelFontSize, WELLVIS.theLabelOpacity);
        gridValue.position.x = value;
        gridValue.position.y = WELLVIS.maxY + WELLVIS.theLabelMargin;
        gridValue.position.z = WELLVIS.theZ;

          //==|| Rotating the text/label/value to level it with the Y-Plane
          gridValue.rotation.set(0, Math.PI, Math.PI/2);

          WELLVIS.theXY_PlaneLabels.add(gridValue);

        }
   // }

  //==|| If more than 2 grids we need to draw additional lines
    //if(noOfGridsInLength > 1){              
        for(var value = (WELLVIS.minY + WELLVIS.theUnit); value <= (WELLVIS.maxY); value += WELLVIS.theUnit) {  
          if(value > (WELLVIS.minY) && value < WELLVIS.maxY) {
            if(value != 0) {
              WELLVIS.theXY_PlaneGridLinesGeo.vertices.push(
                v(WELLVIS.minX, value, WELLVIS.theZ), v(WELLVIS.maxX, value, WELLVIS.theZ)
              );
            }
          }

          var gridValue = createText2D(value + '', WELLVIS.theLabelColor, WELLVIS.theLabelFont, WELLVIS.theLabelFontSize, WELLVIS.theLabelOpacity);
        gridValue.position.x = WELLVIS.minX  - WELLVIS.theLabelMargin;
        gridValue.position.y = value;
        gridValue.position.z = WELLVIS.theZ;

          //==|| Rotating the text/label/value to level it with the Y-Plane
          gridValue.rotation.set(Math.PI, 0, 0);

          WELLVIS.theXZ_PlaneLabels.add(gridValue);


        }
   // }


    //==|| the Gridlines
    WELLVIS.theXY_PlaneGridLines = new THREE.Line(WELLVIS.theXY_PlaneGridLinesGeo, WELLVIS.theXY_PlaneGridLinesMaterial);
    WELLVIS.theXY_PlaneGridLines.type = THREE.Lines;

    //==|| The AxisLine Geometry
  WELLVIS.theXY_PlaneAxisLineGeo = new THREE.Geometry();
    WELLVIS.theXY_PlaneAxisLineGeo.vertices.push(
      v(0, WELLVIS.minY, WELLVIS.theZ), v(0, WELLVIS.maxY, WELLVIS.theZ),
      v(WELLVIS.minX, 0, WELLVIS.theZ), v(WELLVIS.maxX, 0, WELLVIS.theZ)
    );

    //==|| The AxisLine
    WELLVIS.theXY_PlaneAxisLine = new THREE.Line(WELLVIS.theXY_PlaneAxisLineGeo, WELLVIS.theXY_PlaneAxisLineMaterial);
    WELLVIS.theXY_PlaneAxisLine.type = THREE.Lines;





    //==|| Adding axis line to the Plane Grids object   
    WELLVIS.theXY_PlaneGrids.add(WELLVIS.theXY_PlaneGridLines);           
    WELLVIS.theXY_PlaneGrids.add(WELLVIS.theXY_PlaneAxisLine);

    //==|| Adding different lines in the Z-Plane
    WELLVIS.theXY_Plane.add(WELLVIS.theXY_PlaneOutline);
    WELLVIS.theXY_Plane.add(WELLVIS.theXY_PlaneGrids);


  //==|| Adding the labels/values in the Z-Plane
    WELLVIS.theXY_Plane.add(WELLVIS.theXY_PlaneLabels);


    //==|| Adding the X-Plane to the MainObject
    WELLVIS.theMainObject.add(WELLVIS.theXY_Plane);

}



//==|| Draw an Arrow right of the XY Plane to denote the North direction
function drawArrowNorth() {

  

  //==|| The Outline Material
    WELLVIS.theArrowNorthmaterial = new THREE.LineBasicMaterial( {
        color: WELLVIS.theArrowNorthColor, 
        lineWidth: 1,
        transparent: true,
        opacity: WELLVIS.theArrowNorthOpacity
      }
    );



    var midX = (WELLVIS.maxX + WELLVIS.minX) / 2; 

    var halfLength = (WELLVIS.maxX - WELLVIS.minX) / 2 - WELLVIS.theUnit;

    if(halfLength > 3 * WELLVIS.theUnit) { 
      halfLength = 3 * WELLVIS.theUnit;
    }

    colorTrace("midX = " +  midX + "  halfLength = " + halfLength + " minX = " + WELLVIS.minX + " maxX = " + WELLVIS.maxX + "Green");
 
  //==|| The Outline Geometry
    WELLVIS.theArrowNorthgeo = new THREE.Geometry();
    WELLVIS.theArrowNorthgeo.vertices.push(

      v(midX,  WELLVIS.maxY + WELLVIS.theArrowNorth_Margin, WELLVIS.theZ),    v(midX - halfLength,  WELLVIS.maxY + WELLVIS.theArrowNorth_Margin, WELLVIS.theZ),
      v(midX - halfLength,  WELLVIS.maxY + WELLVIS.theArrowNorth_Margin, WELLVIS.theZ),   v(midX - halfLength,  WELLVIS.maxY + WELLVIS.theArrowNorth_Margin - WELLVIS.theArrowNorth_Width, WELLVIS.theZ),
      v(midX,  WELLVIS.maxY + WELLVIS.theArrowNorth_Margin, WELLVIS.theZ),    v(midX + halfLength,  WELLVIS.maxY + WELLVIS.theArrowNorth_Margin, WELLVIS.theZ),
      v(midX + halfLength,  WELLVIS.maxY + WELLVIS.theArrowNorth_Margin, WELLVIS.theZ),   v(midX + WELLVIS.theArrowNorth_Width,  WELLVIS.maxY + WELLVIS.theArrowNorth_Margin - WELLVIS.theArrowNorth_Width, WELLVIS.theZ),
      v(midX + halfLength,  WELLVIS.maxY + WELLVIS.theArrowNorth_Margin, WELLVIS.theZ),   v(midX + WELLVIS.theArrowNorth_Width,  WELLVIS.maxY + WELLVIS.theArrowNorth_Margin + WELLVIS.theArrowNorth_Width, WELLVIS.theZ)


    );


  //==|| The Outline
    WELLVIS.theArrowNorth = new THREE.Line(WELLVIS.theArrowNorthgeo, WELLVIS.theArrowNorthmaterial);
    WELLVIS.theArrowNorth.type = THREE.Lines;

  WELLVIS.theMainObject.add(WELLVIS.theArrowNorth);

}



//==|| Creates the sign at the center of the screen
//==|| which is the center of rotation for object in our 3D Module
function createScreenCenter(x, y, z, centerSignLength, screenCenterSignColor, screenCenterSignOpacity ) {

  //==|| The Screen Center
    var theScreenCenterMaterial = new THREE.LineBasicMaterial( {
        color: screenCenterSignColor, 
        lineWidth: 1,
        transparent: true,
        opacity: screenCenterSignOpacity
      }
    );

  //==|| the Outline Geometry
    var theScreenCenterGeo = new THREE.Geometry();
    theScreenCenterGeo.vertices.push(
      v(x - centerSignLength, y, z), v(x + centerSignLength, y, z),
      v(x, y - centerSignLength, z), v(x, y + centerSignLength, z),
      v(x, y, z - centerSignLength), v(x, y, z + centerSignLength)

    );


    //==|| the Outline
    WELLVIS.theScreenCenter = new THREE.Line(theScreenCenterGeo, theScreenCenterMaterial);
    WELLVIS.theScreenCenter.type = THREE.Lines;

    WELLVIS.theMainObject.add(WELLVIS.theScreenCenter);


}

function updateScreenCenter(x, y, z) {
  //colorTrace("Update Screen Center called ", "Green");

  WELLVIS.theScreenCenter.position.x = x;
  WELLVIS.theScreenCenter.position.y = y;
  WELLVIS.theScreenCenter.position.z = z;

}



