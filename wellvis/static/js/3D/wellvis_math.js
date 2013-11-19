





//######################################################################################################################################
//######################################################################################################################################
//####################   ######   ########   #######             ##  #####  #######           ##########################################
//####################  #  ##  #  #######  #  ###########   #######  #####  ######   ###################################################
//####################  ###  ###  ######  ###  ##########   #######         #######           ##########################################
//####################  ########  #####         #########   #######  #####  ###############    #########################################
//####################  ########  ####  #######  ########   #######  #####  ###############    #########################################
//####################  ########  ###  #########  #######   #######  #####  #######           ##########################################
//######################################################################################################################################
//######################################################################################################################################


//==================================
//==|| Convert Degrees to Radians
//==================================
function radians(degrees) { 
	return (degrees * (Math.PI / 180) );
}

//==================================
//==|| Convert radians to degrees
//==================================
function degrees(radians) { 
	return ( radians * (180 / Math.PI ));
}




//########################################################################################
//########################################################################################
//==|| 						calculate the Tangent
//########################################################################################
//########################################################################################

//==|| newRowData and preRowData are of the type RowData

function methodTangent(newRowData, preRowData) {

	colorTrace("==== Tangent Calculation Starts ====", "Green");


	colorTrace("Previous Row", "Green")
	logValues(preRowData, "Blue");
	
	colorTrace("New Row", "Green")
	logValues(newRowData, "Blue");

	//==|| Calculate x, y, z by tangent method
	var dMD = newRowData.theMD - preRowData.theMD;
	var dN = dMD * (Math.sin(newRowData.theINC * (Math.PI / 180) ) ) * (Math.cos(newRowData.theAZI * (Math.PI / 180)));
	var dE = dMD * (Math.sin(newRowData.theINC * (Math.PI / 180) ) ) * (Math.sin(newRowData.theAZI * (Math.PI / 180)));
	var dZ = dMD * (Math.cos(newRowData.theINC * (Math.PI / 180)));

	newRowData.theCL 	= dMD;
	newRowData.theNS 	= preRowData.theNS + dN;
	newRowData.theEW 	= preRowData.theEW + dE;
	newRowData.theVsec 	= preRowData.theVsec + dZ;


	//==|| Calculating new x,y, z
	var newX = preRowData.theX + dN;
	var newY = preRowData.theY + dE;
	var newZ = preRowData.theZ + dZ;

	newRowData.theX = newX;
	newRowData.theY = newY;
	newRowData.theZ = newZ;

	newRowData.theTVD = preRowData.theTVD + dZ;

	/*
		//==|| Putting new X, Y, Z in the hidden DIVs in the row
		$("#valueX_"  + noOfWellPathLinesStr).val(newX.toFixed(2)) - 0;
		$("#valueY_"  + noOfWellPathLinesStr).val(newY.toFixed(2)) - 0;
		$("#valueZ_"  + noOfWellPathLinesStr).val(newZ.toFixed(2)) - 0;
	*/




	//newRowData.theAZI 	= parseFloat(newRowData.theAZI.toFixed(2));
	newRowData.theCL 	= parseFloat(newRowData.theCL.toFixed(2));
	newRowData.theMD 	= parseFloat(newRowData.theMD.toFixed(2));
	newRowData.theTVD 	= parseFloat(newRowData.theTVD.toFixed(2));
	newRowData.theNS 	= parseFloat(newRowData.theNS.toFixed(2));
	newRowData.theEW 	= parseFloat(newRowData.theEW.toFixed(2));
	newRowData.theVsec 	= parseFloat(newRowData.theVsec.toFixed(2));
	newRowData.theX 	= parseFloat(newRowData.theX.toFixed(2));
	newRowData.theY 	= parseFloat(newRowData.theY.toFixed(2));
	newRowData.theZ 	= parseFloat(newRowData.theZ.toFixed(2));



	colorTrace("-- So the new values are --");
	colorTrace("dMD = " + dMD, "Green");
	colorTrace("dN = " + dN, "Blue");
	colorTrace("dE = " + dE, "Green");
	colorTrace("dZ = " + dZ, "Blue");
	colorTrace("newX = " + newX, "Green");
	colorTrace("newY = " + newY, "Blue");
	colorTrace("newZ = " + newZ, "Green");


	//==||
	return newRowData;

}









//########################################################################################
//########################################################################################
//==||     				Method M1 - INC
//########################################################################################
//########################################################################################

function methodM1INC(newRowData, preRowData) {

	colorTrace("== M1 - INC Calculation starts ==" , "Green");



	//==|| The inputs
	var md1 = preRowData.theMD;
	var I1 = preRowData.theINC;
	var A1 = preRowData.theAZI;

	var I2 = newRowData.theINC;
	var T = newRowData.theTurn;
	var B = newRowData.theBuild;


	colorTrace("The inputs are ", "green");
	colorTrace("md1 = " + md1 + "\t\t I1 = " + I1 + "\t\t A1 = " + A1, "Blue");
	colorTrace("I2 = " + I2 + "\t\t T = " + T + "\t\t B = " + B, "Blue");
	//==|| Testing the forumulas 
	//==|| Test successful 2013-11-08-0058
	/*
	B = 1
	T = 3
	I2 = 65
	//md1 = 
	I1 = 5;
	A1 = 12.51;
	*/

	//==|| Step 1: Calculate RCi
	var factor = 1.016; //==|| 100 ft = 30.48m so factor = 30.48 / 30 = 1.016
	var FtToM = 0.3048; //==|| 1 ft = 0.3048 M
	
	var RCIinFt, RCIinM,
		CLinFt, CLinM;

	if (B != 0) {
		RCIinFt = (180 * (100 / factor)) / (Math.PI * B);
		RCIinM = RCIinFt * FtToM;

		//==|| Step 2: Calcualate CL
		CLinFt = (RCIinFt * Math.PI * (I2 - I1) )/ 180;
		CLinM  = CLinFt * FtToM;
	}
	else {
		RCIinFt = 0;
		RCIinM = 0;
		CLinFt = 0;
		CLinM = 0;
	}


	var RCAinFt, RCAinM;

	if(T != 0 ) {
		//==|| Step 3: Calcualte RCa
		RCAinFt = 180 * (100 / factor) / (Math.PI * Math.abs(T));
		RCAinM  = RCAinFt * FtToM;
 	}
 	else {
 		RCAinFt = 0;
 		RCAinM = 0;
 	}

	//==|| Step 4: Calculate the Azimuth in the end point - A2
	//var A2 = A1 + (ClinFt / FtToM * 180) / (Math.PI * RCAinFt / FtToM);
	//var A2 = A1 + (CLinM * 180) / (Math.PI * RCAinM);

	//==|| Calculating A2
	var A2 = 0;
	var som = 0;
	 
	if(T < 0) {
		som =	-(CLinM * 180 / (Math.PI * RCAinM));
	}
	else {
		som =	(CLinM * 180 / (Math.PI * RCAinM));
	}

	if(A1 + som < 0) {
		A2 = 360 + A1 +  som;
	}
	else {
		A2 = A1 + som;
	}




	//==|| Step 5: Calculate DLS
	var DLS = Math.sqrt(Math.pow(B, 2) + Math.pow(T, 2) * Math.pow(Math.sin(radians(I2)), 2));

	
	colorTrace("RCIinM = " + RCIinM + "\tCLinM = " + CLinM + "\tRCAinM = " + RCAinM + "\tA2 = " + A2 + "\tDLS = " + DLS);

	//==|| Step 6: Calculate DLT and DLB

	var DLT = T * CLinM / 30;
	var DLB = B * CLinM / 30;

	var DLTrad = radians(DLT);
	var DLBrad = radians(DLB);

	var DLTradM , DLBradM;
	if(CLinM != 0) {
		DLTradM = DLTrad / CLinM;	
		DLBradM = DLBrad / CLinM;
	}
	else {
		DLTradM = 0;
		DLBradM = 0;
	}

	colorTrace("DLTradM = " + DLTradM + "\tDLBradM = " + DLBradM );




	//==|| Step 7: Calculate dx, dy, dz or dN, dE, dZ
	var dN, dE, dZ;

	if(DLTradM != 0 && DLBradM != 0) {

		var dN = 1 / (Math.pow(DLTradM, 2) - Math.pow(DLBradM, 2)) * 
				(	DLTradM * (Math.sin(radians(I2)) * Math.sin(radians(A2)) - Math.sin(radians(I1)) * Math.sin(radians(A1))) + 
					DLBradM * (Math.cos(radians(I2)) * Math.cos(radians(A2)) - Math.cos(radians(I1)) * Math.cos(radians(A1)))
				);

		var dE = 1 / (Math.pow(DLTradM, 2) - Math.pow(DLBradM, 2)) * 
				(	-DLTradM * (Math.sin(radians(I2)) * Math.cos(radians(A2)) - Math.sin(radians(I1)) * Math.cos(radians(A1))) + 
					 DLBradM * (Math.cos(radians(I2)) * Math.sin(radians(A2)) - Math.cos(radians(I1)) * Math.sin(radians(A1)))
				);

		var dZ = 1 / DLBradM * (Math.sin(radians(I2)) - Math.sin(radians(I1)));

	}
	else {
		dN = 0;
		dE = 0;
		dZ = 0;
	}





	//==|| Trimming the decimal parts
	//dN = parseFloat(dN.toFixed(2));
	//dE = parseFloat(dE.toFixed(2));
	//dZ = parseFloat(dZ.toFixed(2));

	//CLinM 	= parseFloat(CLinM.toFixed(2));
	//A2 		= parseFloat(A2.toFixed(2));


	//colorTrace("=== M1 - Inc Calcuation ===");
	colorTrace("dN = " + dN + "\tdE = " + dE + "\tdZ = " + dZ);




	var dogleg = 0;

	dogleg = degrees(Math.acos(Math.cos(radians(I1)) * Math.cos(radians(I2))  + Math.sin(radians(I1)) * Math.sin(radians(I2)) * Math.cos(radians(A2 - A1))  ));

	var dls = Math.sqrt(Math.pow(B, 2) + Math.pow(T, 2) * Math.pow( Math.sin(radians(I2) ), 2 )  );


	colorTrace("dogleg = " + dogleg + " DLS = " + dls);



	newRowData.theAZI 	= A2;
	newRowData.theCL 	= CLinM;
	newRowData.theEW 	= preRowData.theEW 		+ dE;
	newRowData.theMD 	= preRowData.theMD 		+ CLinM;
	newRowData.theTVD 	= preRowData.theTVD 	+ dZ;

	newRowData.theNS 	= preRowData.theNS 		+ dN;
	newRowData.theVsec 	= preRowData.theVsec	+ dZ;

	newRowData.theDogleg	= dls;

	newRowData.theX 	= preRowData.theX + dN;
	newRowData.theY 	= preRowData.theY + dE;
	newRowData.theZ 	= preRowData.theZ + dZ;


	newRowData.theINC 	= parseFloat(newRowData.theINC.toFixed(2));
	newRowData.theAZI 	= parseFloat(newRowData.theAZI.toFixed(2));
	newRowData.theCL 	= parseFloat(newRowData.theCL.toFixed(2));
	newRowData.theMD 	= parseFloat(newRowData.theMD.toFixed(2));
	newRowData.theTVD 	= parseFloat(newRowData.theTVD.toFixed(2));
	newRowData.theNS 	= parseFloat(newRowData.theNS.toFixed(2));
	newRowData.theEW 	= parseFloat(newRowData.theEW.toFixed(2));
	newRowData.theVsec 	= parseFloat(newRowData.theVsec.toFixed(2));
	newRowData.theX 	= parseFloat(newRowData.theX.toFixed(2));
	newRowData.theY 	= parseFloat(newRowData.theY.toFixed(2));
	newRowData.theZ 	= parseFloat(newRowData.theZ.toFixed(2));
	newRowData.theDogleg 	= parseFloat(newRowData.theDogleg.toFixed(2));


	colorTrace("== So the new values are ==", "Blue");
	colorTrace("dN = " + newRowData.theNS + "\tdE = " + newRowData.theEW  + "\tdZ = " + newRowData.theVsec + "\tTVD = " + newRowData.theTVD + "\tpre TVD = " + preRowData.theTVD);


	//==||
	return newRowData;

}







//########################################################################################
//########################################################################################
//==|| 										M1-AZI method
//########################################################################################
//########################################################################################

function methodM1AZI(newRowData, preRowData) {

	colorTrace("== M1 - AZI Calculation starts ==" , "Green");



	//==|| The inputs
	var md1 = preRowData.theMD;
	var I1 = preRowData.theINC;
	var A1 = preRowData.theAZI;

	//var I2 = newRowData.theINC;
	var A2 = newRowData.theAZI;
	var T = newRowData.theTurn;
	var B = newRowData.theBuild;


	colorTrace("The inputs are ", "green");
	colorTrace("md1 = " + md1 + "\t\t I1 = " + I1 + "\t\t A1 = " + A1, "Blue");
	colorTrace("A2 = " + A2 + "\t\t T = " + T + "\t\t B = " + B, "Blue");
	//==|| Testing the forumulas 
	//==|| Test successful 2013-11-08-0058
	/*
	B = 1
	T = -3
	A2 = 345
	//md1 = 
	I1 = 5;
	A1 = 12.51;
	*/


	
	var factor = 1.016; //==|| 100 ft = 30.48m so factor = 30.48 / 30 = 1.016
	var FtToM = 0.3048; //==|| 1 ft = 0.3048 M
	
	//==|| Step 1: Calculate RCa
	var RCAinFt, RCAinM;

	if(T != 0 ) {
		//==|| Step 3: Calcualte RCa
		RCAinFt = 180 * (100 / factor) / (Math.PI * Math.abs(T));
		RCAinM  = RCAinFt * FtToM;
 	}
 	else {
 		RCAinFt = 0;
 		RCAinM = 0;
 	}


 	var dA = 0;
 	//==calculating dA
 	if(T < 0) {
 		if(A1 < A2) { 
 			dA = 360 - A2 + A1;
 		}
 		else { 
 			dA = A1 - A2;
 		}
 	}
 	else {
 		if(A2 < A1) { 
 			dA = 360 - A1 + A2;
 		}
 		else {
 			dA = A2 - A1;
 		}
 	}


	//==|| Step 2: Calcualate CL
	var	CLinFt, CLinM;

	CLinFt = (RCAinFt * Math.PI * (dA) )/ 180;
	CLinM  = CLinFt * FtToM;


	var RCIinFt, RCIinM;
	if (B != 0) {
		RCIinFt = (180 * (100 / factor)) / (Math.PI * B);
		RCIinM = RCIinFt * FtToM;

		
	}
	else {
		RCIinFt = 0;
		RCIinM = 0;
		CLinFt = 0;
		CLinM = 0;
	}


	//==|| Step 4: Calculate the Inclination in the end point - I2
	//var A2 = A1 + (ClinFt / FtToM * 180) / (Math.PI * RCIinFt / FtToM);
	var I2 = I1 + (CLinM * 180) / (Math.PI * RCIinM);


	//==|| Step 5: Calculate DLS
	var DLS = Math.sqrt(Math.pow(B, 2) + Math.pow(T, 2) * Math.pow(Math.sin(radians(I2)), 2));

	
	colorTrace("RCIinM = " + RCIinM + "\tCLinM = " + CLinM + "\tRCAinM = " + RCAinM + "\tI2 = " + I2 + "\tDLS = " + DLS);

	//==|| Step 6: Calculate DLT and DLB

	var DLT = T * CLinM / 30;
	var DLB = B * CLinM / 30;

	var DLTrad = radians(DLT);
	var DLBrad = radians(DLB);

	var DLTradM , DLBradM;
	if(CLinM != 0) {
		DLTradM = DLTrad / CLinM;	
		DLBradM = DLBrad / CLinM;
	}
	else {
		DLTradM = 0;
		DLBradM = 0;
	}

	colorTrace("DLTradM = " + DLTradM + "\tDLBradM = " + DLBradM );

	
	//==|| Step 7: Calculate x, y, z
	var dN, dE, dZ;

	if(DLTradM != 0 && DLBradM != 0) { 
	
		dN = 1 / (Math.pow(DLTradM, 2) - Math.pow(DLBradM, 2)) * 
			(	DLTradM * (Math.sin(radians(I2)) * Math.sin(radians(A2)) - Math.sin(radians(I1)) * Math.sin(radians(A1))) + 
				DLBradM * (Math.cos(radians(I2)) * Math.cos(radians(A2)) - Math.cos(radians(I1)) * Math.cos(radians(A1)))
			);

		dE = 1 / (Math.pow(DLTradM, 2) - Math.pow(DLBradM, 2)) * 
			(	-DLTradM * (Math.sin(radians(I2)) * Math.cos(radians(A2)) - Math.sin(radians(I1)) * Math.cos(radians(A1))) + 
				 DLBradM * (Math.cos(radians(I2)) * Math.sin(radians(A2)) - Math.cos(radians(I1)) * Math.sin(radians(A1)))
			);

		dZ = 1 / DLBradM * (Math.sin(radians(I2)) - Math.sin(radians(I1)));
	}
	else {
		dN = 0;
		dE = 0;
		dZ = 0;
	}


	//==|| Trimming the decimal parts
	//dN = parseFloat(dN.toFixed(2));
	//dE = parseFloat(dE.toFixed(2));
	//dZ = parseFloat(dZ.toFixed(2));

	//CLinM 	= parseFloat(CLinM.toFixed(2));
	//A2 		= parseFloat(A2.toFixed(2));


	//colorTrace("=== M1 - Inc Calcuation ===");
	colorTrace("dN = " + dN + "\tdE = " + dE + "\tdZ = " + dZ);




	var dogleg = 0;

	dogleg = degrees(Math.acos(Math.cos(radians(I1)) * Math.cos(radians(I2))  + Math.sin(radians(I1)) * Math.sin(radians(I2)) * Math.cos(radians(A2 - A1))  ));

	var dls = Math.sqrt(Math.pow(B, 2) + Math.pow(T, 2) * Math.pow( Math.sin(radians(I2) ), 2 )   );


	colorTrace("dogleg = " + dogleg + " DLS = " + dls);










	//newRowData.theAZI 	= A2;
	newRowData.theINC 	= I2;
	newRowData.theCL 	= CLinM;
	newRowData.theMD 	= preRowData.theMD 		+ CLinM;
	newRowData.theTVD 	= preRowData.theTVD 	+ dZ;

	newRowData.theNS 	= preRowData.theNS 		+ dN;
	newRowData.theEW 	= preRowData.theEW 		+ dE;
	newRowData.theVsec 	= preRowData.theVsec	+ dZ;
	newRowData.theDogleg = dls;

	newRowData.theX 	= preRowData.theX + dN;
	newRowData.theY 	= preRowData.theY + dE;	
	newRowData.theZ 	= preRowData.theZ + dZ;



	newRowData.theINC 	= parseFloat(newRowData.theINC.toFixed(2));
	newRowData.theAZI 	= parseFloat(newRowData.theAZI.toFixed(2));
	newRowData.theCL 	= parseFloat(newRowData.theCL.toFixed(2));
	newRowData.theMD 	= parseFloat(newRowData.theMD.toFixed(2));
	newRowData.theTVD 	= parseFloat(newRowData.theTVD.toFixed(2));
	newRowData.theNS 	= parseFloat(newRowData.theNS.toFixed(2));
	newRowData.theEW 	= parseFloat(newRowData.theEW.toFixed(2));
	newRowData.theVsec 	= parseFloat(newRowData.theVsec.toFixed(2));
	newRowData.theX 	= parseFloat(newRowData.theX.toFixed(2));
	newRowData.theY 	= parseFloat(newRowData.theY.toFixed(2));
	newRowData.theZ 	= parseFloat(newRowData.theZ.toFixed(2));
	newRowData.theDogleg 	= parseFloat(newRowData.theDogleg.toFixed(2));


	colorTrace("== So the new values are ==", "Blue");
	//colorTrace("dN = " + newRowData.theNS + "\tdE = " + newRowData.theEW  + "\tdZ = " + newRowData.theVsec + "\tTVD = " + newRowData.theTVD + "\tpre TVD = " + preRowData.theTVD);

	logValues(newRowData, "Green");

	//==||
	return newRowData;
}





//########################################################################################
//########################################################################################
//==|| 								M1 - TVD method
//########################################################################################
//########################################################################################


function methodM1TVD(newRowData, preRowData) {

	colorTrace("== M1 - TVD Calculation starts ==" , "Green");



	//==|| The inputs
	var md1 = preRowData.theMD;
	var I1 = preRowData.theINC;
	var A1 = preRowData.theAZI;
	var tvd1 = preRowData.theTVD;

	//var I2 = newRowData.theINC;
	//var A2 = newRowData.theAZI;
	var tvd2 = newRowData.theTVD;
	var T 	= newRowData.theTurn;
	var B 	= newRowData.theBuild;


	colorTrace("The inputs are ", "green");
	colorTrace("md1 = " + md1 + "\t\t I1 = " + I1 + "\t\t A1 = " + A1, "Blue");
	colorTrace("tvd2 = " + tvd2 + "\t\t T = " + T + "\t\t B = " + B, "Blue");
	//==|| Testing the forumulas 
	//==|| Test successful 2013-11-08-0058
	/*
	B = 1
	T = -3
	A2 = 345
	//md1 = 
	I1 = 5;
	A1 = 12.51;
	*/



	
	var factor = 1.016;  //==|| 100 ft = 30.48m so factor = 30.48 / 30 = 1.016
	var FtToM  = 0.3048; //==|| 1 ft = 0.3048 M
	

	//==|| Step 1: Calculate RCi
	var RCIinFt, RCIinM;
	if (B != 0) {
		RCIinFt = (180 * (100 / factor)) / (Math.PI * B);
		RCIinM = RCIinFt * FtToM;
		
	}
	else {
		RCIinFt = 0;
		RCIinM = 0;
		CLinFt = 0;
		CLinM = 0;
	}

	colorTrace("RCIinFt = " + RCIinFt + "   , RCIinM = " + RCIinM);
	//==|| dTVD should not turn negative
	var dTVD = 0;
	if(tvd2 - tvd1 < 0) {
		tvd2 =  tvd1 + 1;
		dTVD = tvd2;
	}
	else {
		dTVD = tvd2 - tvd1;
	}


	//==|| Step 2: Calculating I2
	var I2 = degrees(Math.asin( dTVD / RCIinM + (Math.sin(radians(I1))) ));



	colorTrace("I2 = " + I2 + " dTVD = " + dTVD + "\n dTVD/RCIinM = " + dTVD / RCIinM);

	var RCAinFt, RCAinM;

	if(T != 0 ) {
		//==|| Step 3: Calcualte RCa
		RCAinFt = 180 * (100 / factor) / (Math.PI * Math.abs(T));
		RCAinM  = RCAinFt * FtToM;
 	}
 	else {
 		RCAinFt = 0;
 		RCAinM = 0;
 	}


	//==|| Step 4: Calcualate CL
	var	CLinFt, CLinM;

	CLinFt = (RCIinFt * Math.PI * (I2 - I1) )/ 180;
	CLinM  = CLinFt * FtToM;




	//==|| Calculating A2
	var A2 = 0;
	var som = 0;
	 
	if(T < 0) {
		som =	-(CLinM * 180 / (Math.PI * RCAinM));
	}
	else {
		som =	(CLinM * 180 / (Math.PI * RCAinM));
	}

	if(A1 + som < 0) {
		A2 = 360 + A1 +  som;
	}
	else {
		A2 = A1 + som;
	}







	//==|| Step 5: Calculate DLS
	var DLS = Math.sqrt(Math.pow(B, 2) + Math.pow(T, 2) * Math.pow(Math.sin(radians(I2)), 2));

	
	colorTrace("RCIinM = " + RCIinM + "\tCLinM = " + CLinM + "\tRCAinM = " + RCAinM + "\tI2 = " + I2 + "\tDLS = " + DLS);

	//==|| Step 6: Calculate DLT and DLB

	var DLT = T * CLinM / 30;
	var DLB = B * CLinM / 30;

	var DLTrad = radians(DLT);
	var DLBrad = radians(DLB);

	var DLTradM , DLBradM;
	if(CLinM != 0) {
		DLTradM = DLTrad / CLinM;	
		DLBradM = DLBrad / CLinM;
	}
	else {
		DLTradM = 0;
		DLBradM = 0;
	}

	colorTrace("DLTradM = " + DLTradM + "\tDLBradM = " + DLBradM );


	//==|| Step 7: Calculate x, y, z
	var dN, dE, dZ;

	if(DLTradM != 0 && DLBradM != 0) {

		dN = 1 / (Math.pow(DLTradM, 2) - Math.pow(DLBradM, 2)) * 
				(	DLTradM * (Math.sin(radians(I2)) * Math.sin(radians(A2)) - Math.sin(radians(I1)) * Math.sin(radians(A1))) + 
					DLBradM * (Math.cos(radians(I2)) * Math.cos(radians(A2)) - Math.cos(radians(I1)) * Math.cos(radians(A1)))
				);

		dE = 1 / (Math.pow(DLTradM, 2) - Math.pow(DLBradM, 2)) * 
				(	-DLTradM * (Math.sin(radians(I2)) * Math.cos(radians(A2)) - Math.sin(radians(I1)) * Math.cos(radians(A1))) + 
					 DLBradM * (Math.cos(radians(I2)) * Math.sin(radians(A2)) - Math.cos(radians(I1)) * Math.sin(radians(A1)))
				);

		dZ = 1 / DLBradM * (Math.sin(radians(I2)) - Math.sin(radians(I1)));
	}
	else {
		dN = 0;
		dE = 0;
		dZ = 0;
	}


	//==|| Trimming the decimal parts
	//dN = parseFloat(dN.toFixed(2));
	//dE = parseFloat(dE.toFixed(2));
	//dZ = parseFloat(dZ.toFixed(2));

	//CLinM 	= parseFloat(CLinM.toFixed(2));
	//A2 		= parseFloat(A2.toFixed(2));


	//colorTrace("=== M1 - Inc Calcuation ===");
	colorTrace("dN = " + dN + "\tdE = " + dE + "\tdZ = " + dZ);



	var dogleg = 0;

	dogleg = degrees(Math.acos(Math.cos(radians(I1)) * Math.cos(radians(I2))  + Math.sin(radians(I1)) * Math.sin(radians(I2)) * Math.cos(radians(A2 - A1))  ));

	var dls = Math.sqrt(Math.pow(B, 2) + Math.pow(T, 2) * Math.pow( Math.sin(radians(I2) ), 2 )   );


	colorTrace("dogleg = " + dogleg + " DLS = " + dls);







	newRowData.theAZI 	= A2;
	newRowData.theINC 	= I2;
	newRowData.theCL 	= CLinM;
	newRowData.theMD 	= preRowData.theMD 		+ CLinM;
	newRowData.theTVD 	= preRowData.theTVD 	+ dZ;

	newRowData.theNS 	= preRowData.theNS 		+ dN;
	newRowData.theEW 	= preRowData.theEW 		+ dE;
	newRowData.theVsec 	= preRowData.theVsec	+ dZ;
	newRowData.theDogleg = dls;

	newRowData.theX 	= preRowData.theX + dN;
	newRowData.theY 	= preRowData.theY + dE;	
	newRowData.theZ 	= preRowData.theZ + dZ;



	newRowData.theINC 	= parseFloat(newRowData.theINC.toFixed(2));
	newRowData.theAZI 	= parseFloat(newRowData.theAZI.toFixed(2));
	newRowData.theCL 	= parseFloat(newRowData.theCL.toFixed(2));
	newRowData.theMD 	= parseFloat(newRowData.theMD.toFixed(2));
	newRowData.theTVD 	= parseFloat(newRowData.theTVD.toFixed(2));
	newRowData.theNS 	= parseFloat(newRowData.theNS.toFixed(2));
	newRowData.theEW 	= parseFloat(newRowData.theEW.toFixed(2));
	newRowData.theVsec 	= parseFloat(newRowData.theVsec.toFixed(2));
	newRowData.theX 	= parseFloat(newRowData.theX.toFixed(2));
	newRowData.theY 	= parseFloat(newRowData.theY.toFixed(2));
	newRowData.theZ 	= parseFloat(newRowData.theZ.toFixed(2));
	newRowData.theDogleg 	= parseFloat(newRowData.theDogleg.toFixed(2));


	colorTrace("== So the new values are ==", "Blue");
	//colorTrace("dN = " + newRowData.theNS + "\tdE = " + newRowData.theEW  + "\tdZ = " + newRowData.theVsec + "\tTVD = " + newRowData.theTVD + "\tpre TVD = " + preRowData.theTVD);

	logValues(newRowData, "Green");

	//==||
	return newRowData;
}



