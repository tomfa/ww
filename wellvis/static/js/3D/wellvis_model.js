







//######################################################################################################################################
//######################################################################################################################################
//####################   ######   ######    #####        ####      ###  ##########        ##############################################
//####################  #  ##  #  ####   ##   #####  ##   ###  #######  #########   ####################################################
//####################  ###  ###  ####  ####  #####  ###   ##     ####  ##########        ##############################################
//####################  ########  ####  ####  #####  ###   ##  #######  ################   #############################################
//####################  ########  ####   ##   #####  ##   ###  #######  ##### #########    #############################################
//####################  ########  ######    #####        ####       ##        ####        ##############################################
//######################################################################################################################################
//######################################################################################################################################


//==|| The object that holds everything about a line
function TheLine(theStartPoint, theEndPoint, theColor, theLineWidth, theLineOpacity) {
	this.theStartPoint 	= theStartPoint;
	this.theEndPoint 	= theEndPoint;
	this.theColor 		= theColor;
	this.theLineWidth 	= theLineWidth;
	this.theLineOpacity = theLineOpacity;
};

//==|| The Object that would store everything that a single row in Table has
//==|| The Table being the left-panel where user inputs values
function RowData(theMD, theCL, theINC, theAZI, theTVD, theX, theY, theZ, theNS, theEW, theVsec, theDogleg, theBuild, theTurn, theSecType) {
	this.theMD 		= theMD;
	this.theCL 		= theCL;
	this.theINC 	= theINC;
	this.theAZI 	= theAZI;
	this.theTVD 	= theTVD; 
	this.theX 		= theX;
	this.theY 		= theY;
	this.theZ 		= theZ;
	this.theNS 		= theNS;
	this.theEW 		= theEW;
	this.theVsec	= theVsec;
	this.theDogleg	= theDogleg;
	this.theBuild 	= theBuild;
	this.theTurn	= theTurn;
	this.theSecType	= theSecType;
}


//==|| The function that creates a new RowData object with exactly same values that the passed argument RowData object contains
function duplicateThisRowData(rowData) { 
	return new RowData(	
						rowData.theMD,		rowData.theCL, 
						rowData.theINC, 	rowData.theAZI, 	rowData.theTVD, 
						rowData.theX,		rowData.theY, 		rowData.theZ, 
						rowData.theNS, 		rowData.theEW, 		rowData.theVsec, 
						rowData.theDogleg,	rowData.theBuild, 	rowData.theTurn, 
						rowData.theSecType
					);

}




//==|| Takes in the integer value and return the equivalent value in 3-letters (String)
//==|| 1 becomes 001, 11 becomes 011 
function changeNoOfWellPathLinesIntoString(no) {

	if(no > 0 && no <= 999) {
		if(no < 10) {
			return "00" + no;
		}
		else if(no > 9 && no < 100){
			return "0" + no;
		}
		else {
			return no + "";
		}
	}
	else {
		return "000";
	}


}












