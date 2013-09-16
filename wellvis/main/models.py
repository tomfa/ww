from django.db import models
from django.contrib.auth.models import User

class Country(models.Model):
    """
    Holds the data model for a Country.
    A country is a top level model that contains oil fields, platforms, 
    and wells.
    """
    name = models.CharField(max_length=30)
    short_name = models.CharField(max_length=6)
    country_code = models.CharField(max_length=10)
    description = models.CharField(max_length=100)

    def __unicode__(self):
        return self.name

class Field(models.Model):
    """
    Holds the data model for a oil Field.
    Every oil field belongs to a Country, and contains platforms.
    """
    name = models.CharField(max_length=30)
    short_name = models.CharField(max_length=6)
    description = models.CharField(max_length=100)
    country = models.ForeignKey(Country) 

    def __unicode__(self):
        return self.name

class Platform(models.Model):
    """
    Holds the data model for a Platform.
    Every platform belongs to an oil field, and contains wells.
    """
    name = models.CharField(max_length=30)
    short_name = models.CharField(max_length=6)
    # Latitude goes from -90 (south) to 90 (north)
    latitude =  models.DecimalField(max_digits=8, decimal_places=6)  
    # Logitude goes from -180 (west) to 180 (east)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)  
    description = models.CharField(max_length=100)
    field = models.ForeignKey(Field) 

    def __unicode__(self):
        return self.name

class Well(models.Model):
    """
    Holds the data model for a Well.
    A well connects a Platform to an oil repository. 
    """
    name = models.CharField(max_length=30)
    short_name = models.CharField(max_length=6)
    description = models.CharField(max_length=100) 
    platform = models.ForeignKey(Platform)

    def __unicode__(self):
        return self.name
