from django.db import models
from django.contrib.auth.models import User


class Country(models.Model):
    """
    A country is a top level model that contains oil :model:`main.Field`, 
    :model:`main.Platform` and :model:`main.Well` within that country.
    """
    name = models.CharField(max_length=30)
    short_name = models.CharField(max_length=6)
    country_code = models.CharField(max_length=10)
    description = models.CharField(max_length=100)

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name_plural = u"countries"


class Field(models.Model):
    """
    Every oil field belongs to a :model:`main.Country`, and contains 
    multiple :model:`main.Platform`.
    """
    name = models.CharField(max_length=30)
    short_name = models.CharField(max_length=6)
    description = models.CharField(max_length=100)
    country = models.ForeignKey(Country) 

    def __unicode__(self):
        return self.name


class Platform(models.Model):
    """
    Every platform belongs to an oil :model:`main.Field`, and contains 
    :model:`main.Well`.
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
    A well connects a :model:`main.Project` to an oil repository. 
    """
    name = models.CharField(max_length=30)
    short_name = models.CharField(max_length=6)
    description = models.CharField(max_length=100) 
    platform = models.ForeignKey(Platform)

    def __unicode__(self):
        return self.name


class Project(models.Model):
    """
    A Well has a one-to-one relation to a Project.
    The Project connects all the information regarding a well.
    """
    name = models.CharField(max_length=30)
    responsible = models.ForeignKey(User, related_name="project_responsible")
    users = models.ManyToManyField(User, related_name="project_users")
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    # below: to be implemented
    # path = models.ForeignKey(wPath)
    # force = models.ForeignKey(wForce)
    # design = models.ForeignKey(wDesign)
    # plan = models.ForeignKey(wPlan)

    def __unicode__(self):
        return self.name


class ProjectComment(models.Model):
    """
    Users should be able to discuss projects. Later, this could be expanded 
    to proper notifications or issues. For now, it's just a place to leave
    some text for others to see that regards the project.
    """
    title = models.CharField(max_length=20)
    description = models.CharField(max_length=300)
    owner = models.ForeignKey(User)
    project = models.ForeignKey(Project)
    response_to = models.ForeignKey('self', null=True, blank=True)
    date = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.title


class LogType(models.Model):
    """
    Log type defines different sort of :model:`main.LogElement`. For example,
    propagated changes are of less importance than writes or updates 
    initiated by a user interaction. 
    """
    name = models.CharField(max_length=20)
    description = models.CharField(max_length=100)
    hexcolor = models.CharField(max_length=20)

    def __unicode__(self):
        return self.name

class LogElement(models.Model):
    """
    A log element is a logging of an individual event that has happened in a
    :model:`main.Project`. It is triggered by an action done by the system
    or a :model:`auth.User` that changes the project.
    """
    short_description = models.CharField(max_length=40)
    description = models.CharField(max_length=400)
    date = models.DateTimeField(auto_now=True)
    type = models.ForeignKey(LogType)
    user = models.ForeignKey(User)
    project = models.ForeignKey(Project)

    def __unicode__(self):
        return self.short_description

