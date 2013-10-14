from django.db import models
from main.models import Project


class Algorithm(models.Model):
    """
    An algorithm for calculating path between :model:`wpath.HelpPoint`. 
    """
    name = models.CharField(max_length=30, unique=True)
    short_name = models.CharField(max_length=4, unique=True)
    description = models.CharField(max_length=300)

    def __unicode__(self):
        return self.name


class HelpPointType(models.Model):
    """
    Defines a type of :model:`wpath.HelpPoint`, e.g. end point, or no-go
    point.
    """
    name = models.CharField(max_length=20, unique=True)
    short_name = models.CharField(max_length=4, unique=True)
    description = models.CharField(max_length=200)
    hex_color = models.CharField(max_length=6)

    def __unicode__(self):
        return self.name


class Path(models.Model):
    """
    Path is the main class containing all the necessary objects to construct
    the well path.
    """
    version = models.PositiveIntegerField()
    algorithm = models.ForeignKey(Algorithm)
    project = models.ForeignKey(Project)
    minX = models.IntegerField()
    maxX = models.IntegerField()
    minY = models.IntegerField()
    maxY = models.IntegerField()
    theZ = models.IntegerField()
    theUnit = models.IntegerField()


    def __unicode__(self):
        return self.project.name + "_" + self.version


class HelpPoint(models.Model):
    """
    A HelpPoint is a place in space guiding the wells path. It could be a
    box that one would want to go through, or one to avoid. 
    """
    depth = models.PositiveIntegerField()   # theMD
    direction = models.IntegerField()       # theAZI
    inclination = models.IntegerField()     # theINC
    x = models.IntegerField()               
    y = models.IntegerField()
    z = models.IntegerField()
    radius = models.PositiveIntegerField(null=True)
    type = models.ForeignKey(HelpPointType)
    wpath = models.ForeignKey(Path)
    previous_point = models.ForeignKey('self', null=True, blank=True,
        related_name="previous_helppoint")
    next_point = models.ForeignKey('self', null=True, blank=True,
        related_name="next_helppoint")


class IntermediatePoint(models.Model):
    """
    IntermediatePoints are points between helppoints. They are the points
    after the HelpPoint they are linked to.
    """
    parentPoint = models.ForeignKey(HelpPoint)
    x = models.IntegerField()               
    y = models.IntegerField()
    z = models.IntegerField()
    previous_point = models.ForeignKey('self', null=True, blank=True,
        related_name="previous_intermediatepoint")
    next_point = models.ForeignKey('self', null=True, blank=True,
        related_name="next_intermediatepoint")
