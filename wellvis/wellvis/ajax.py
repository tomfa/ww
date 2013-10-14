from django.shortcuts import render_to_response, render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from main.models import Country, Field, Platform, Well, Project
from wpath.models import Path, HelpPoint, IntermediatePoint, HelpPointType, Algorithm
from django.core import serializers
import json


def get_well(request, wellpk):
    """
    Read of well data.
    """
    response_data = {}
        # if user is not logged in, return the home function
    if not request.user.is_authenticated():
        response_data['message'] = "403 Error: You are not authenticated"
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    well = Well.objects.filter(pk=wellpk)

    if not well:
        response_data['message'] = "404 Error: Well " + wellpk + " not found"
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    well = well[0]
    project = Project.objects.filter(well=well)

    if not project:
        response_data['message'] = "404 Error: Project not found attached to well " + well.pk
        return HttpResponse(json.dumps(response_data), content_type="application/json")
    
    project = project[0]
    path = Path.objects.filter(project=project)

    if not path:
        response_data['message'] = "404 Error: Path not found attached to project " + project.pk
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    serialized_well = {
        "minX"  : path.minX,
        "maxX"  : path.maxX,
        "minY"  : path.minY,
        "maxY"  : path.maxY,
        "theZ"  : path.theZ,
        "theUnit" : path.theUnit,
        "theValues": []
    }

    selected_wellpoint = HelpPoint.objects.filter(wpath=path, previous_point=None)
    wellpoints = []
    if selected_wellpoint:
        while selected_wellpoint:
            wellpoints.append(selected_wellpoint[0])
            selected_wellpoint = selected_wellpoint[0].next_point


    for wellpoint in wellpoints:
        wellpointObj = {}
        wellpointObj['theMD'] = wellpoint.depth
        wellpointObj['theINC'] = wellpoint.direction
        wellpointObj['theAZI'] = wellpoint.inclination
        wellpointObj['x'] = wellpoint.x
        wellpointObj['y'] = wellpoint.y
        wellpointObj['z'] = wellpoint.z
        wellpointObj['thePoints'] = []

        selected_intermediatepoint = IntermediatePoint.filter(parentPoint=wellpoint, previous_point=None)
        intermediatePoints = []
        if selected_intermediatepoint:
            while selected_intermediatepoint:
                intermediatePoints.append(selected_intermediatepoint[0])
                selected_intermediatepoint = selected_intermediatepoint[0].next.point
        
        for intermediatePoint in intermediatePoints:
            wellpointObj['thePoints'].append({
                "x": intermediatePoint.x,
                "y": intermediatePoint.y,
                "z": intermediatePoint.z,
            })

        serialized_well['theValues'].append(wellpointObj)
    
    return HttpResponse(json.dumps(serialized_well), content_type="application/json")

def update_well(request, wellpk):
    """
    Write of well data.
    """
    response_data = {}
        # if user is not logged in, return the home function
    if not request.user.is_authenticated():
        response_data['message'] = "403 Error: You are not authenticated"
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    well = Well.objects.filter(pk=wellpk)

    if not well:
        response_data['message'] = "404 Error: Well not found"
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    # TODO: Implement update from POST object
    response_data['message'] = "500 Error: Not implemented functionality"
    well = well[0]

    return HttpResponse(json.dumps(response_data), content_type="application/json")


def userconfig(request, userpk):
    """
    Dump/read of user 3d configuration
    """
    response_data = {}
        # if user is not logged in, return the home function
    if not request.user.is_authenticated():
        response_data['message'] = "403 Error: You are not authenticated"
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    # TODO: Implement update from POST object
    response_data['message'] = "500 Error: Not implemented functionality"

    return HttpResponse(json.dumps(response_data), content_type="application/json")