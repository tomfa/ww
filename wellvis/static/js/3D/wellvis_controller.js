






//######################################################################################################################################
//######################################################################################################################################
//##########        ######        ####     ####   ##            ##         #####       ####   #######   #######      ###        ########
//########    ####   ###    ####    ##      ###   ######   #######   ###    ##    ###    ##   #######   #######   ######   ###   #######
//########   ###########   ######   ##   #   ##   ######   #######        ####   #####   ##   #######   #######     ####        ########
//########   ###########   ######   ##   ##   #   ######   #######   #   #####   #####   ##   #######   #######   ######   #   #########
//########    ####   ###    ####    ##   ###      ######   #######   ##   ####    ###    ##   #### ##   #### ##   ######   ##   ########
//##########        ######        ####   ####     ######   #######   ###   #####       ####        ##        ##       ##   ###   #######
//######################################################################################################################################
//######################################################################################################################################





//===================================================================================
//==|| Reads theWellJSONdata JSON object and constructs the well according to it
//===================================================================================
function readWellJSONdata(theWellJSONdata) {

	//==|| Resetting the Previous point to be Origin
	WELLVIS.thePreviousPoint = new THREE.Vector3(0,0,0); 

	//==|| Resetting the No. of well Path lines to be 0
   	WELLVIS.noOfWellPathLines = 0;

   	//==|| Emptying the Tables of values
   	 $("#theAddPathContainer").empty();

	
	var data = theWellJSONdata;

		//==|| Read the ranges for the Axes Plane
		WELLVIS.minX 	= data.minX;
		WELLVIS.maxX 	= data.maxX;
		WELLVIS.minY 	= data.minY;
		WELLVIS.maxY	= data.maxY;
		WELLVIS.theZ 	= data.theZ;
		WELLVIS.theUnit = data.theUnit;

		
		//==|| Redraw the Axes planes according to the new ranges
		redrawAxesPlanes();


		//==|| These are the values User inputted
		var theValues = data.theValues;

		//==|| Iterate through the values
		$.each(theValues, function(valuesIndex) {
				
				//==|| The values 
				var theMD 		= theValues[valuesIndex].theMD;
				var theCL 		= theValues[valuesIndex].theCL;
				var theINC 		= theValues[valuesIndex].theINC;
				var theAZI		= theValues[valuesIndex].theAZI;
				var theTVD		= theValues[valuesIndex].theTVD;
				var itsX 		= theValues[valuesIndex].itsX;
				var itsY 		= theValues[valuesIndex].itsY;
				var itsZ 		= theValues[valuesIndex].itsZ;
				var itsNS		= theValues[valuesIndex].itsNS;
				var itsEW		= theValues[valuesIndex].itsEW;
				var itsVsec		= theValues[valuesIndex].itsVsec;
				var theDogleg	= theValues[valuesIndex].theDogleg;
				var theBuild	= theValues[valuesIndex].theBuild;
				var theTurn		= theValues[valuesIndex].theTurn;
				var theSecType	= theValues[valuesIndex].theSecType;


				colorTrace("Reading Data from the JSON object", "RED");
				colorTrace("theMD = " + theMD + "\ttheCL = " + theCL + "\ttheINC = " + theINC + "\ttheAZI = " + theAZI + "\ttheTVD = " + theTVD, "Blue");
				colorTrace("itsX = " + itsX + "\titsY = " + itsY + "\titsZ = " + itsZ + "\titsNS = " + itsNS + "\titsEW = " + itsEW + "\titsVsec = " + itsVsec, "Green");
				colorTrace("theDogleg = " + theDogleg + "\ttheBuild = " + theBuild + "\ttheTurn = " + theTurn + "\ttheSecType = " + theSecType, "Blue");
				
				//==|| These are the points that make up the line
				//==|| NOTE: currently not doing anything with them...
				var thePoints 	= theValues[valuesIndex].thePoints;
						
			
				//==|| Add this to our main Well path object
				addWellPath(itsX, itsY, itsZ);

				if(valuesIndex == (theValues.length - 1)) {
					colorTrace("this is the last one", "Red");

					//==|| Add a new Row in the table with the values shown
					addNewRowInTable(	WELLVIS.noOfWellPathLines, 
										theMD, theCL, 
										theINC, theAZI, theTVD, 
										itsX, itsY, itsZ, itsNS, itsEW, itsVsec, 
										theDogleg, theBuild, theTurn, 
										theSecType, "Nothing" , false
									);
				}
				else {
					//==|| Add a new Row in the table with the values shown
					addNewRowInTable(	WELLVIS.noOfWellPathLines, 
										theMD, theCL, 
										theINC, theAZI, theTVD, 
										itsX, itsY, itsZ, itsNS, itsEW, itsVsec, 
										theDogleg, theBuild, theTurn, 
										theSecType, "Nothing" , false
									);
				}	
				

				WELLVIS.noOfWellPathLines++;
				
				colorTrace("inside readWllJSONdata  no.of well path lines " + WELLVIS.noOfWellPathLines, "Green");

			
				registerButtonPressReleaseEffects();


				$.each(thePoints, function(pointsIndex) {
					var x = thePoints[pointsIndex].x;
					var y = thePoints[pointsIndex].y;
					var z = thePoints[pointsIndex].z;
					
					/*
					//==|| Let's check the values
					colorTrace("x : " + x, "Green");
					colorTrace("y : " + y, "Blue");
					colorTrace("z : " + z, "Green");
					*/

					//==|| Need to do something with these points later ||==
					// ****
					// ****
					// ****
					// ****
				});

				

		});

	//==|| Adding a new row
	addNewRowInTable(WELLVIS.noOfWellPathLines, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "Tangent", "Add", true);	

	colorTrace("inside readWllJSONdata 2 no.of well path lines " + WELLVIS.noOfWellPathLines, "Green");

	//==|| Register the event listeners for the Buttons
	registerAddPathButton();

	registerButtonPressReleaseEffects();

	//==|| Render the changes
	render();	


}




//===================================================================================
//==|| Save the Well JSON data 
//===================================================================================
function saveWellJSONdata() {
	
	//save_wellpath(well_pk, theWellJSONdata);

}




//=========================================
//==|| Save the Configurations/Settings 
//=========================================
function saveSettings() {		

	theDefaultSettingsJSONdata.theSceneColor 							= WELLVIS.theSceneColor;
	theDefaultSettingsJSONdata.theWellLineColor 						= WELLVIS.theWellLineColor;
	theDefaultSettingsJSONdata.theWellLineOpacity 						= WELLVIS.theWellLineOpacity;
	theDefaultSettingsJSONdata.theXY_PlaneOutlineMaterialColor 			= WELLVIS.theXY_PlaneOutlineMaterialColor;
	theDefaultSettingsJSONdata.theXY_PlaneOutlineMaterialLineOpacity 	= WELLVIS.theXY_PlaneOutlineMaterialLineOpacity;
	theDefaultSettingsJSONdata.theXY_PlaneGridLinesMaterialColor 		= WELLVIS.theXY_PlaneGridLinesMaterialColor;
	theDefaultSettingsJSONdata.theXY_PlaneGridLinesMaterialLineOpacity 	= WELLVIS.theXY_PlaneGridLinesMaterialLineOpacity;
	theDefaultSettingsJSONdata.theXY_PlaneAxisLineMaterialColor 		= WELLVIS.theXY_PlaneAxisLineMaterialColor;
	theDefaultSettingsJSONdata.theXY_PlaneAxisLineMaterialLineOpacity 	= WELLVIS.theXY_PlaneAxisLineMaterialLineOpacity;
	theDefaultSettingsJSONdata.theXZ_PlaneOutlineMaterialColor 			= WELLVIS.theXZ_PlaneOutlineMaterialColor;
	theDefaultSettingsJSONdata.theXZ_PlaneOutlineMaterialLineOpacity 	= WELLVIS.theXZ_PlaneOutlineMaterialLineOpacity;
	theDefaultSettingsJSONdata.theXZ_PlaneGridLinesMaterialColor 		= WELLVIS.theXZ_PlaneGridLinesMaterialColor;
	theDefaultSettingsJSONdata.theXZ_PlaneGridLinesMaterialLineOpacity 	= WELLVIS.theXZ_PlaneGridLinesMaterialLineOpacity;
	theDefaultSettingsJSONdata.theXZ_PlaneAxisLineMaterialColor 		= WELLVIS.theXZ_PlaneAxisLineMaterialColor;
	theDefaultSettingsJSONdata.theXZ_PlaneAxisLineMaterialLineOpacity 	= WELLVIS.theXZ_PlaneAxisLineMaterialLineOpacity;
	theDefaultSettingsJSONdata.theYZ_PlaneOutlineMaterialColor 			= WELLVIS.theYZ_PlaneOutlineMaterialColor;
	theDefaultSettingsJSONdata.theYZ_PlaneOutlineMaterialLineOpacity 	= WELLVIS.theYZ_PlaneOutlineMaterialLineOpacity;
	theDefaultSettingsJSONdata.theYZ_PlaneGridLinesMaterialColor 		= WELLVIS.theYZ_PlaneGridLinesMaterialColor;
	theDefaultSettingsJSONdata.theYZ_PlaneGridLinesMaterialLineOpacity 	= WELLVIS.theYZ_PlaneGridLinesMaterialLineOpacity;
	theDefaultSettingsJSONdata.theYZ_PlaneAxisLineMaterialColor 		= WELLVIS.theYZ_PlaneAxisLineMaterialColor;
	theDefaultSettingsJSONdata.theYZ_PlaneAxisLineMaterialLineOpacity 	= WELLVIS.theYZ_PlaneAxisLineMaterialLineOpacity;
	theDefaultSettingsJSONdata.theLabelColor 							= WELLVIS.theLabelColor;
	theDefaultSettingsJSONdata.theLabelFontSize 						= WELLVIS.theLabelFontSize;
	theDefaultSettingsJSONdata.theLabelOpacity 							= WELLVIS.theLabelOpacity;
	theDefaultSettingsJSONdata.theArrowNorthColor 						= WELLVIS.theArrowNorthColor;
	theDefaultSettingsJSONdata.theArrowNorthOpacity 					= WELLVIS.theArrowNorthOpacity;
	theDefaultSettingsJSONdata.screenCenterSignColor 					= WELLVIS.creenCenterSignColor;
	theDefaultSettingsJSONdata.screenCenterSignOpacity 					= WELLVIS.screenCenterSignOpacity;


	//==|| Save the configuration
	save_3dconfig(theDefaultSettingsJSONdata);

}






//============================================================
//==|| Reading the 3D Module Setting from a JSON object
//==|| and update the 3D Module according to it.
//============================================================
function readSettings(data) {
 	//var data = theDefaultSettingsJSONdata;
 	
 	//==|| Get the Values from the JSON object
 	WELLVIS.theSceneColor					  	= data.theSceneColor;
 	WELLVIS.theWellLineColor				  	= data.theWellLineColor;
 	WELLVIS.theWellLineOpacity					= data.theWellLineOpacity;

 	WELLVIS.theXY_PlaneOutlineMaterialColor	  			= data.theXY_PlaneOutlineMaterialColor;
 	WELLVIS.theXY_PlaneOutlineMaterialLineOpacity	  	= data.theXY_PlaneOutlineMaterialLineOpacity;
	WELLVIS.theXY_PlaneGridLinesMaterialColor 			= data.theXY_PlaneGridLinesMaterialColor;
	WELLVIS.theXY_PlaneGridLinesMaterialLineOpacity 	= data.theXY_PlaneGridLinesMaterialLineOpacity;
	WELLVIS.theXY_PlaneAxisLineMaterialColor  			= data.theXY_PlaneAxisLineMaterialColor;
	WELLVIS.theXY_PlaneAxisLineMaterialLineOpacity  	= data.theXY_PlaneAxisLineMaterialLineOpacity;

	WELLVIS.theXZ_PlaneOutlineMaterialColor	  			= data.theXZ_PlaneOutlineMaterialColor;
	WELLVIS.theXZ_PlaneOutlineMaterialLineOpacity		= data.theXZ_PlaneOutlineMaterialLineOpacity;
	WELLVIS.theXZ_PlaneGridLinesMaterialColor 			= data.theXZ_PlaneGridLinesMaterialColor;
	WELLVIS.theXZ_PlaneGridLinesMaterialLineOpacity 	= data.theXZ_PlaneGridLinesMaterialLineOpacity;
	WELLVIS.theXZ_PlaneAxisLineMaterialColor  			= data.theXZ_PlaneAxisLineMaterialColor;
	WELLVIS.theXZ_PlaneAxisLineMaterialLineOpacity  	= data.theXZ_PlaneAxisLineMaterialLineOpacity;

	WELLVIS.theYZ_PlaneOutlineMaterialColor   			= data.theYZ_PlaneOutlineMaterialColor;
	WELLVIS.theYZ_PlaneOutlineMaterialLineOpacity		= data.theYZ_PlaneOutlineMaterialLineOpacity;
	WELLVIS.theYZ_PlaneGridLinesMaterialColor 			= data.theYZ_PlaneGridLinesMaterialColor;
	WELLVIS.theYZ_PlaneGridLinesMaterialLineOpacity		= data.theYZ_PlaneGridLinesMaterialLineOpacity;
	WELLVIS.theYZ_PlaneAxisLineMaterialColor  			= data.theYZ_PlaneAxisLineMaterialColor;
	WELLVIS.theYZ_PlaneAxisLineMaterialLineOpacity		= data.theYZ_PlaneAxisLineMaterialLineOpacity;

	WELLVIS.theLabelColor				= data.theLabelColor;
	WELLVIS.theLabelFontSize			= data.theLabelFontSize;
	WELLVIS.theLabelOpacity				= data.theLabelOpacity;

	WELLVIS.theArrowNorthColor			= data.theArrowNorthColor;
	WELLVIS.theArrowNorthOpacity		= data.theArrowNorthOpacity;
	WELLVIS.screenCenterSignColor		= data.screenCenterSignColor;
	WELLVIS.screenCenterSignOpacity		= data.screenCenterSignOpacity;


	//==|| Show the values in their respective Input boxes in the Configuration Tab in the Left Panel
	$("#theSceneColorInput").val(WELLVIS.theSceneColor);
	$("#theWellPathColorInput").val(WELLVIS.theWellLineColor);

	$("#XYplaneOutlineColorInput").val(WELLVIS.theXY_PlaneOutlineMaterialColor);
	$("#XYplaneGridlineColorInput").val(WELLVIS.theXY_PlaneGridLinesMaterialColor);
	$("#XYplaneAxislineColorInput").val(WELLVIS.theXY_PlaneAxisLineMaterialColor);

	$("#XZplaneOutlineColorInput").val(WELLVIS.theXZ_PlaneOutlineMaterialColor);
	$("#XZplaneGridlineColorInput").val(WELLVIS.theXZ_PlaneGridLinesMaterialColor);
	$("#XZplaneAxislineColorInput").val(WELLVIS.theXZ_PlaneAxisLineMaterialColor);

	$("#YZplaneOutlineColorInput").val(WELLVIS.theYZ_PlaneOutlineMaterialColor);
	$("#YZplaneGridlineColorInput").val(WELLVIS.theYZ_PlaneGridLinesMaterialColor);
	$("#YZplaneAxislineColorInput").val(WELLVIS.theYZ_PlaneAxisLineMaterialColor);

	$("#labelColorInput").val(WELLVIS.theLabelColor);
	//$("#labelSizeInput").val(theLabelFontSize);

	$("#arrowColorInput").val(WELLVIS.theArrowNorthColor);
	$("#rotationSignColorInput").val(WELLVIS.screenCenterSignColor);




	//###############################################################################################################
	//##########################################[ The Color Pickers ]################################################
	//###############################################################################################################
	
	//========================
	//==|| For the Scene
	//========================
	$("#theSceneColorInput").spectrum({
	    preferredFormat: "hex",
	    showInitial: true,
	    showInput: true,
	    move: function(tinycolor) {
	    	tinycolor = tinycolor.toHexString();
			changeSceneColor(tinycolor);
			render();
	    },
	    hide: function(tinycolor) {
            tinycolor = tinycolor.toHexString();
	    	changeSceneColor(tinycolor);
	    	WELLVIS.theSceneColor = tinycolor;

			saveSettings();

			render();
        }
	});


	//========================
	//==|| For the Well Path
	//========================
	$("#theWellPathColorInput").spectrum({
	    preferredFormat: "hex",
	    showInitial: true,
	    showInput: true,
	    move: function(tinycolor) {
	    	tinycolor = tinycolor.toHexString();	    	
	    	WELLVIS.theWellLineColor = tinycolor;
			redrawWellPath(true);
			render();
	    },
	    hide: function(tinycolor) {
            tinycolor = tinycolor.toHexString();
	    	WELLVIS.theWellLineColor = tinycolor;
	    	redrawWellPath(true);
			render();

			saveSettings();
        }
	});


	//==================================
	//==|| For the Outline of XY Plane
	//==================================
	$("#XYplaneOutlineColorInput").spectrum({
	    preferredFormat: "hex",
	    showInitial: true,
	    showInput: true,
	    move: function(tinycolor) {
	    	tinycolor = tinycolor.toHexString();	    	
	    	WELLVIS.theXY_PlaneOutlineMaterialColor = tinycolor;

			//==|| Empty XY Plane first
			emptyXY_Plane();
			//==|| Redrawing the XY Plane
			drawXY_Plane();	
			render();
	    },
	    hide: function(tinycolor) {
            tinycolor = tinycolor.toHexString();
	    	//theWellLineColor = tinycolor;	    	
	    	WELLVIS.theXY_PlaneOutlineMaterialColor = tinycolor;

			//==|| Empty XY Plane first
			emptyXY_Plane();
			//==|| Redrawing the XY Plane
			drawXY_Plane();	
			render();

			saveSettings();
        }
	});



	//=======================================
	//==|| For the Gridlines  of XY Plane
	//=======================================
	$("#XYplaneGridlineColorInput").spectrum({
	    preferredFormat: "hex",
	    showInitial: true,
	    showInput: true,
	    move: function(tinycolor) {
	    	tinycolor = tinycolor.toHexString();	    	
	    	WELLVIS.theXY_PlaneGridLinesMaterialColor = tinycolor;

			//==|| Empty XY Plane first
			emptyXY_Plane();
			//==|| Redrawing the XY Plane
			drawXY_Plane();	
			render();
	    },
	    hide: function(tinycolor) {
            tinycolor = tinycolor.toHexString();
	    	//theWellLineColor = tinycolor;	    	
	    	WELLVIS.theXY_PlaneGridLinesMaterialColor = tinycolor;

			//==|| Empty XY Plane first
			emptyXY_Plane();
			//==|| Redrawing the XY Plane
			drawXY_Plane();	
			render();

			saveSettings();
        }
	});


	//=======================================
	//==|| For the Axes lines  of XY Plane
	//=======================================
	$("#XYplaneAxislineColorInput").spectrum({
	    preferredFormat: "hex",
	    showInitial: true,
	    showInput: true,
	    move: function(tinycolor) {
	    	tinycolor = tinycolor.toHexString();	    	
	    	WELLVIS.theXY_PlaneAxisLineMaterialColor = tinycolor;

			//==|| Empty XY Plane first
			emptyXY_Plane();
			//==|| Redrawing the XY Plane
			drawXY_Plane();	
			render();
	    },
	    hide: function(tinycolor) {
            tinycolor = tinycolor.toHexString();
	    	//theWellLineColor = tinycolor;	    	
	    	WELLVIS.theXY_PlaneAxisLineMaterialColor = tinycolor;

			//==|| Empty XY Plane first
			emptyXY_Plane();
			//==|| Redrawing the XY Plane
			drawXY_Plane();	
			render();

			saveSettings();
        }
	});



	//=======================================
	//==|| For the Outline of XZ Plane
	//=======================================
	$("#XZplaneOutlineColorInput").spectrum({
	    preferredFormat: "hex",
	    showInitial: true,
	    showInput: true,
	    move: function(tinycolor) {
	    	tinycolor = tinycolor.toHexString();	    	
	    	WELLVIS.theXZ_PlaneOutlineMaterialColor = tinycolor;

			//==|| Empty XY Plane first
			emptyXZ_Plane();
			//==|| Redrawing the XY Plane
			drawXZ_Plane();	
			render();
	    },
	    hide: function(tinycolor) {
            tinycolor = tinycolor.toHexString();
	    	//theWellLineColor = tinycolor;	    	
	    	WELLVIS.theXZ_PlaneOutlineMaterialColor = tinycolor;

			//==|| Empty XY Plane first
			emptyXZ_Plane();
			//==|| Redrawing the XY Plane
			drawXZ_Plane();	
			render();

			saveSettings();
        }
	});



	//=======================================
	//==|| For the Gridlines  of XZ Plane
	//=======================================
	$("#XZplaneGridlineColorInput").spectrum({
	    preferredFormat: "hex",
	    showInitial: true,
	    showInput: true,
	    move: function(tinycolor) {
	    	tinycolor = tinycolor.toHexString();	    	
	    	WELLVIS.theXZ_PlaneGridLinesMaterialColor = tinycolor;

			//==|| Empty XY Plane first
			emptyXZ_Plane();
			//==|| Redrawing the XY Plane
			drawXZ_Plane();	
			render();
	    },
	    hide: function(tinycolor) {
            tinycolor = tinycolor.toHexString();
	    	//theWellLineColor = tinycolor;	    	
	    	WELLVIS.theXZ_PlaneGridLinesMaterialColor = tinycolor;

			//==|| Empty XY Plane first
			emptyXZ_Plane();
			//==|| Redrawing the XY Plane
			drawXZ_Plane();	
			render();

			saveSettings();
        }
	});


	//=======================================
	//==|| For the Axes lines  of XZ Plane
	//=======================================
	$("#XZplaneAxislineColorInput").spectrum({
	    preferredFormat: "hex",
	    showInitial: true,
	    showInput: true,
	    move: function(tinycolor) {
	    	tinycolor = tinycolor.toHexString();	    	
	    	WELLVIS.theXZ_PlaneAxisLineMaterialColor = tinycolor;

			//==|| Empty XY Plane first
			emptyXZ_Plane();
			//==|| Redrawing the XY Plane
			drawXZ_Plane();	
			render();
	    },
	    hide: function(tinycolor) {
            tinycolor = tinycolor.toHexString();
	    	//theWellLineColor = tinycolor;	    	
	    	WELLVIS.theXZ_PlaneAxisLineMaterialColor = tinycolor;

			//==|| Empty XY Plane first
			emptyXZ_Plane();
			//==|| Redrawing the XY Plane
			drawXZ_Plane();	
			render();

			saveSettings();
        }
	});



	//=======================================
	//==|| For the Outline of YZ Plane
	//=======================================
	$("#YZplaneOutlineColorInput").spectrum({
	    preferredFormat: "hex",
	    showInitial: true,
	    showInput: true,
	    move: function(tinycolor) {
	    	tinycolor = tinycolor.toHexString();	    	
	    	WELLVIS.theYZ_PlaneOutlineMaterialColor = tinycolor;

			//==|| Empty XY Plane first
			emptyYZ_Plane();
			//==|| Redrawing the XY Plane
			drawYZ_Plane();	
			render();
	    },
	    hide: function(tinycolor) {
            tinycolor = tinycolor.toHexString();
	    	//theWellLineColor = tinycolor;	    	
	    	WELLVIS.theYZ_PlaneOutlineMaterialColor = tinycolor;

			//==|| Empty XY Plane first
			emptyYZ_Plane();
			//==|| Redrawing the XY Plane
			drawYZ_Plane();	
			render();

			saveSettings();
        }
	});



	//=======================================
	//==|| For the Gridlines  of YZ Plane
	//=======================================
	$("#YZplaneGridlineColorInput").spectrum({
	    preferredFormat: "hex",
	    showInitial: true,
	    showInput: true,
	    move: function(tinycolor) {
	    	tinycolor = tinycolor.toHexString();	    	
	    	WELLVIS.theYZ_PlaneGridLinesMaterialColor = tinycolor;

			//==|| Empty XY Plane first
			emptyYZ_Plane();
			//==|| Redrawing the XY Plane
			drawYZ_Plane();	
			render();
	    },
	    hide: function(tinycolor) {
            tinycolor = tinycolor.toHexString();
	    	//theWellLineColor = tinycolor;	    	
	    	WELLVIS.theYZ_PlaneGridLinesMaterialColor = tinycolor;

			//==|| Empty XY Plane first
			emptyYZ_Plane();
			//==|| Redrawing the XY Plane
			drawYZ_Plane();	
			render();

			saveSettings();
        }
	});


	//=======================================
	//==|| For the Axes lines  of YZ Plane
	//=======================================
	$("#YZplaneAxislineColorInput").spectrum({
	    preferredFormat: "hex",
	    showInitial: true,
	    showInput: true,
	    move: function(tinycolor) {
	    	tinycolor = tinycolor.toHexString();	    	
	    	WELLVIS.theYZ_PlaneAxisLineMaterialColor = tinycolor;

			//==|| Empty XY Plane first
			emptyYZ_Plane();
			//==|| Redrawing the XY Plane
			drawYZ_Plane();	
			render();
	    },
	    hide: function(tinycolor) {
            tinycolor = tinycolor.toHexString();
	    	//theWellLineColor = tinycolor;	    	
	    	WELLVIS.theYZ_PlaneAxisLineMaterialColor = tinycolor;

			//==|| Empty XY Plane first
			emptyYZ_Plane();
			//==|| Redrawing the XY Plane
			drawYZ_Plane();	
			render();

			saveSettings();
        }
	});


	//=======================================
	//==|| For the Labels
	//=======================================
	$("#labelColorInput").spectrum({
	    preferredFormat: "hex",
	    showInitial: true,
	    showInput: true,
	    move: function(tinycolor) {
	    	tinycolor = tinycolor.toHexString();	    	
	    	WELLVIS.theLabelColor = tinycolor;

			//==|| Empty all Axes Planes first
			emptyYZ_Plane();
			emptyXY_Plane();
			emptyXZ_Plane();

			//==|| Redrawing all Axes Planes
			drawYZ_Plane();
			drawXY_Plane();
			drawXZ_Plane();

			render();
	    },
	    hide: function(tinycolor) {
            tinycolor = tinycolor.toHexString();
	    	//theWellLineColor = tinycolor;	    	
	    	WELLVIS.theLabelColor = tinycolor;

			//==|| Empty all Axes Planes first
			emptyYZ_Plane();
			emptyXY_Plane();
			emptyXZ_Plane();

			//==|| Redrawing all Axes Planes
			drawYZ_Plane();	
			drawXY_Plane();
			drawXZ_Plane();
			render();

			saveSettings();
        }
	});


	//=======================================
	//==|| For the North arrow
	//=======================================
	$("#arrowColorInput").spectrum({
	    preferredFormat: "hex",
	    showInitial: true,
	    showInput: true,
	    move: function(tinycolor) {
	    	tinycolor = tinycolor.toHexString();	    	
	    	WELLVIS.theArrowNorthColor = tinycolor;
					
			//==|| remove the previous North Arrow 
			WELLVIS.theMainObject.remove(WELLVIS.theArrowNorth);

			//==|| Now redraw the North Arrow
			drawArrowNorth();

			render();
	    },
	    hide: function(tinycolor) {
            tinycolor = tinycolor.toHexString();
	    	//theWellLineColor = tinycolor;	    	
	    	WELLVIS.theArrowNorthColor = tinycolor;
					
			//==|| remove the previous North Arrow 
			WELLVIS.theMainObject.remove(WELLVIS.theArrowNorth);

			//==|| Now redraw the North Arrow
			drawArrowNorth();

			render();

			saveSettings();
        }
	});


	//=======================================
	//==|| For the North arrow
	//=======================================
	$("#rotationSignColorInput").spectrum({
	    preferredFormat: "hex",
	    showInitial: true,
	    showInput: true,
	    move: function(tinycolor) {
	    	tinycolor = tinycolor.toHexString();	    	
	    	WELLVIS.screenCenterSignColor = tinycolor;
				
			//==|| remove the previous Screen Center		
			WELLVIS.theMainObject.remove(WELLVIS.theScreenCenter);
			//==|| Now create a new Screen Center
			createScreenCenter( 	WELLVIS.theCameraTarget.x, 
									WELLVIS.theCameraTarget.y, 
									WELLVIS.theCameraTarget.z, 
									WELLVIS.centerSignLength, 
									WELLVIS.screenCenterSignColor, 
									WELLVIS.screenCenterSignOpacity
							);

			
			render();
	    },
	    hide: function(tinycolor) {
            tinycolor = tinycolor.toHexString();
	    	//theWellLineColor = tinycolor;	    	
	    	WELLVIS.screenCenterSignColor = tinycolor;

	    	//==|| remove the previous Screen Center
	    	WELLVIS.theMainObject.remove(WELLVIS.theScreenCenter);			
			//==|| Now create a new Screen Center		
			createScreenCenter(		WELLVIS.theCameraTarget.x, 
									WELLVIS.theCameraTarget.y, 
									WELLVIS.theCameraTarget.z, 
									WELLVIS.centerSignLength, 
									WELLVIS.screenCenterSignColor, 
									WELLVIS.screenCenterSignOpacity
							);

			render();


			saveSettings();
        }
	});



	//###########################################################################################################
	//##########################################[ Opactiy Sliders ]##############################################
	//###########################################################################################################

	//=======================================
	//==|| Opacity Slider for the Well Path
	//=======================================
	$("#theWellPathLineOpacity").noUiSlider({
		range: [0,1],
		start: WELLVIS.theWellLineOpacity,
		steps: 0.01,
		handles: 1,

		slide: function(){
			var values = $(this).val();
			//colorTrace("Current Slide value is = " + values, "Green");
			var displayValue = parseFloat(values);

			//==|| new opacity value
			WELLVIS.theWellLineOpacity = displayValue;
			
			//==|| Redraw the well path with new changed features
			redrawWellPath(true);
			render();

			//$(this).find(".noUi-origin-lower").html('<div class="noUi-handle noUi-handle-lower"></div>' + '<span class="opacityValue">' + values + "</span>");
			//==|| Display the current Opacity value in the Slide handle
			$(this).find(".noUi-handle-lower").html( displayValue.toFixed(1) );

   		},
   		set: function() {
   			colorTrace("Slide Stopped", "Red");

   			//==|| Lets Empty Slider handle 
   			$(this).find(".noUi-handle-lower").html("");

   			saveSettings();
   		}
	});


	//==============================================
	//==|| Opacity Slider for the XY Plane Outline
	//==============================================
	$("#XYplaneOutlineLineOpacity").noUiSlider({
		range: [0,1],
		start: WELLVIS.theXY_PlaneOutlineMaterialLineOpacity,
		steps: 0.01,
		handles: 1,

		slide: function(){
			var values = $(this).val();
			var displayValue = parseFloat(values);

			WELLVIS.theXY_PlaneOutlineMaterialLineOpacity = displayValue;

			emptyXY_Plane();
			drawXY_Plane();
			render();

			//==|| Display the current Opacity value in the Slide handle
			$(this).find(".noUi-handle-lower").html( displayValue.toFixed(1) );

   		},
   		set: function() {
   			//==|| Lets Empty Slider handle 
   			$(this).find(".noUi-handle-lower").html("");

   			saveSettings();
   		}
	});


	//==============================================
	//==|| Opacity Slider for the XY Plane Outline
	//==============================================
	$("#XYplaneGridlineLineOpacity").noUiSlider({
		range: [0,1],
		start: WELLVIS.theXY_PlaneGridLinesMaterialLineOpacity,
		steps: 0.01,
		handles: 1,

		slide: function(){
			var values = $(this).val();
			var displayValue = parseFloat(values);

			WELLVIS.theXY_PlaneGridLinesMaterialLineOpacity = displayValue;

			emptyXY_Plane();
			drawXY_Plane();
			render();

			//==|| Display the current Opacity value in the Slide handle
			$(this).find(".noUi-handle-lower").html( displayValue.toFixed(1) );

   		},
   		set: function() {
   			//==|| Lets Empty Slider handle 
   			$(this).find(".noUi-handle-lower").html("");

   			saveSettings();
   		}
	});



	//==============================================
	//==|| Opacity Slider for the XY Plane Outline
	//==============================================
	$("#XYplaneAxislineLineOpacity").noUiSlider({
		range: [0,1],
		start: WELLVIS.theXY_PlaneAxisLineMaterialLineOpacity,
		steps: 0.01,
		handles: 1,

		slide: function(){
			var values = $(this).val();
			var displayValue = parseFloat(values);

			WELLVIS.theXY_PlaneAxisLineMaterialLineOpacity = displayValue;

			emptyXY_Plane();
			drawXY_Plane();
			render();

			//==|| Display the current Opacity value in the Slide handle
			$(this).find(".noUi-handle-lower").html( displayValue.toFixed(1) );

   		},
   		set: function() {
   			//==|| Lets Empty Slider handle 
   			$(this).find(".noUi-handle-lower").html("");

   			saveSettings();
   		}
	});






	//==============================================
	//==|| Opacity Slider for the XZ Plane Outline
	//==============================================
	$("#XZplaneOutlineLineOpacity").noUiSlider({
		range: [0,1],
		start: WELLVIS.theXZ_PlaneOutlineMaterialLineOpacity,
		steps: 0.01,
		handles: 1,

		slide: function(){
			var values = $(this).val();
			var displayValue = parseFloat(values);

			WELLVIS.theXZ_PlaneOutlineMaterialLineOpacity = displayValue;

			emptyXZ_Plane();
			drawXZ_Plane();
			render();

			//==|| Display the current Opacity value in the Slide handle
			$(this).find(".noUi-handle-lower").html( displayValue.toFixed(1) );

   		},
   		set: function() {
   			//==|| Lets Empty Slider handle 
   			$(this).find(".noUi-handle-lower").html("");

   			saveSettings();
   		}
	});


	//================================================
	//==|| Opacity Slider for the XZ Plane Gridline
	//================================================
	$("#XZplaneGridlineLineOpacity").noUiSlider({
		range: [0,1],
		start: WELLVIS.theXZ_PlaneGridLinesMaterialLineOpacity,
		steps: 0.01,
		handles: 1,

		slide: function(){
			var values = $(this).val();
			var displayValue = parseFloat(values);

			WELLVIS.theXZ_PlaneGridLinesMaterialLineOpacity = displayValue;

			emptyXZ_Plane();
			drawXZ_Plane();
			render();

			//==|| Display the current Opacity value in the Slide handle
			$(this).find(".noUi-handle-lower").html( displayValue.toFixed(1) );

   		},
   		set: function() {
   			//==|| Lets Empty Slider handle 
   			$(this).find(".noUi-handle-lower").html("");

   			saveSettings();
   		}
	});



	//================================================
	//==|| Opacity Slider for the XZ Plane Axisline
	//================================================
	$("#XZplaneAxislineLineOpacity").noUiSlider({
		range: [0,1],
		start: WELLVIS.theXZ_PlaneAxisLineMaterialLineOpacity,
		steps: 0.01,
		handles: 1,

		slide: function(){
			var values = $(this).val();
			var displayValue = parseFloat(values);

			WELLVIS.theXZ_PlaneAxisLineMaterialLineOpacity = displayValue;

			emptyXZ_Plane();
			drawXZ_Plane();
			render();

			//==|| Display the current Opacity value in the Slide handle
			$(this).find(".noUi-handle-lower").html( displayValue.toFixed(1) );

   		},
   		set: function() {
   			//==|| Lets Empty Slider handle 
   			$(this).find(".noUi-handle-lower").html("");

   			saveSettings();
   		}
	});






	//================================================
	//==|| Opacity Slider for the YZ Plane Outline
	//================================================
	$("#YZplaneOutlineLineOpacity").noUiSlider({
		range: [0,1],
		start: WELLVIS.theYZ_PlaneOutlineMaterialLineOpacity,
		steps: 0.01,
		handles: 1,

		slide: function(){
			var values = $(this).val();
			var displayValue = parseFloat(values);

			WELLVIS.theYZ_PlaneOutlineMaterialLineOpacity = displayValue;

			emptyYZ_Plane();
			drawYZ_Plane();
			render();

			//==|| Display the current Opacity value in the Slide handle
			$(this).find(".noUi-handle-lower").html( displayValue.toFixed(1) );

   		},
   		set: function() {
   			//==|| Lets Empty Slider handle 
   			$(this).find(".noUi-handle-lower").html("");

   			saveSettings();
   		}
	});


	//================================================
	//==|| Opacity Slider for the YZ Plane Gridlines
	//================================================
	$("#YZplaneGridlineLineOpacity").noUiSlider({
		range: [0,1],
		start: WELLVIS.theYZ_PlaneGridLinesMaterialLineOpacity,
		steps: 0.01,
		handles: 1,

		slide: function(){
			var values = $(this).val();
			var displayValue = parseFloat(values);

			WELLVIS.theYZ_PlaneGridLinesMaterialLineOpacity = displayValue;

			emptyYZ_Plane();
			drawYZ_Plane();
			render();

			//==|| Display the current Opacity value in the Slide handle
			$(this).find(".noUi-handle-lower").html( displayValue.toFixed(1) );

   		},
   		set: function() {
   			//==|| Lets Empty Slider handle 
   			$(this).find(".noUi-handle-lower").html("");

   			saveSettings();
   		}
	});



	//================================================
	//==|| Opacity Slider for the YZ Plane Axis Line
	//================================================
	$("#YZplaneAxislineLineOpacity").noUiSlider({
		range: [0,1],
		start: WELLVIS.theYZ_PlaneAxisLineMaterialLineOpacity,
		steps: 0.01,
		handles: 1,

		slide: function(){
			var values = $(this).val();
			var displayValue = parseFloat(values);

			WELLVIS.theYZ_PlaneAxisLineMaterialLineOpacity = displayValue;

			emptyYZ_Plane();
			drawYZ_Plane();
			render();

			//==|| Display the current Opacity value in the Slide handle
			$(this).find(".noUi-handle-lower").html( displayValue.toFixed(1) );

   		},
   		set: function() {
   			//==|| Lets Empty Slider handle 
   			$(this).find(".noUi-handle-lower").html("");

   			saveSettings();
   		}
	});




	//================================================
	//==|| Opacity Slider for the North Arrow 
	//================================================
	$("#arrowOpacity").noUiSlider({
		range: [0,1],
		start: WELLVIS.theArrowNorthOpacity,
		steps: 0.01,
		handles: 1,

		slide: function(){
			var values = $(this).val();
			var displayValue = parseFloat(values);

			WELLVIS.theArrowNorthOpacity = displayValue;

			//==|| remove the previous North Arrow 
			WELLVIS.theMainObject.remove(WELLVIS.theArrowNorth);

			//==|| Now redraw the North Arrow
			drawArrowNorth();
			render();

			//==|| Display the current Opacity value in the Slide handle
			$(this).find(".noUi-handle-lower").html( displayValue.toFixed(1) );

   		},
   		set: function() {
   			//==|| Lets Empty Slider handle 
   			$(this).find(".noUi-handle-lower").html("");

   			saveSettings();
   		}
	});





	//=====================================================
	//==|| Opacity Slider for the Center of Rotation Sign
	//=====================================================
	$("#rotationSignOpacity").noUiSlider({
		range: [0,1],
		start: WELLVIS.screenCenterSignOpacity,
		steps: 0.01,
		handles: 1,

		slide: function(){
			var values = $(this).val();
			var displayValue = parseFloat(values);

			WELLVIS.screenCenterSignOpacity = displayValue;

	    	//==|| remove the previous Screen Center
	    	WELLVIS.theMainObject.remove(WELLVIS.theScreenCenter);			
			//==|| Now create a new Screen Center
			createScreenCenter( 	WELLVIS.theCameraTarget.x, 
									WELLVIS.theCameraTarget.y, 
									WELLVIS.theCameraTarget.z, 
									WELLVIS.centerSignLength, 
									WELLVIS.screenCenterSignColor, 
									WELLVIS.screenCenterSignOpacity
							);
			render();

			//==|| Display the current Opacity value in the Slide handle
			$(this).find(".noUi-handle-lower").html( displayValue.toFixed(1) );

   		},
   		set: function() {
   			//==|| Lets Empty Slider handle 
   			$(this).find(".noUi-handle-lower").html("");

   			saveSettings();
   		}
	});





	//=====================================================
	//==|| Opacity Slider for the Center of Rotation Sign
	//=====================================================
	$("#labelSizeSlider").noUiSlider({
		range: [300,950],
		start: WELLVIS.theLabelFontSize,
		steps: 50,
		handles: 1,

		slide: function(){
			var values = $(this).val();
			var displayValue = parseInt(values);

			WELLVIS.theLabelFontSize = displayValue;

			//==|| Empty all Axes Planes first
			emptyYZ_Plane();
			emptyXY_Plane();
			emptyXZ_Plane();

			//==|| Redrawing all Axes Planes
			drawYZ_Plane();
			drawXY_Plane();
			drawXZ_Plane();

			render();

			//==|| Display the current Opacity value in the Slide handle
			$(this).find(".noUi-handle-lower").html( displayValue);

   		},
   		set: function() {
   			//==|| Lets Empty Slider handle 
   			$(this).find(".noUi-handle-lower").html("");

   			saveSettings();
   		}
	});





	//=====================================================
	//==|| Opacity Slider for the Center of Rotation Sign
	//=====================================================
	$("#labelOpacity").noUiSlider({
		range: [0,1],
		start: WELLVIS.theLabelOpacity,
		steps: 0.01,
		handles: 1,

		slide: function(){
			var values = $(this).val();
			var displayValue = parseFloat(values);

			WELLVIS.theLabelOpacity = displayValue;

			//==|| Empty all Axes Planes first
			emptyYZ_Plane();
			emptyXY_Plane();
			emptyXZ_Plane();

			//==|| Redrawing all Axes Planes
			drawYZ_Plane();
			drawXY_Plane();
			drawXZ_Plane();

			render();

			//==|| Display the current Opacity value in the Slide handle
			$(this).find(".noUi-handle-lower").html( displayValue.toFixed(1));

   		},
   		set: function() {
   			//==|| Lets Empty Slider handle 
   			$(this).find(".noUi-handle-lower").html("");

   			saveSettings();
   		}
	});


//############################################
//######[ Finally Redrawing everything ]######
//############################################


	//==|| Change the Scene color
	changeSceneColor(WELLVIS.theSceneColor);

	//==|| remove the previous Screen Center
	WELLVIS.theMainObject.remove(WELLVIS.theScreenCenter);	
	//==|| Now create a new Screen Center		
	createScreenCenter( 	WELLVIS.theCameraTarget.x, 
							WELLVIS.theCameraTarget.y, 
							WELLVIS.theCameraTarget.z, 
							WELLVIS.centerSignLength, 
							WELLVIS.screenCenterSignColor, 
							WELLVIS.screenCenterSignOpacity
					);


	//==|| Read the Settings 
	redrawAxesPlanes();
	redrawWellPath(true);





} //==||################################################# readSettings() //#########################################















