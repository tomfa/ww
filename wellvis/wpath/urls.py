from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'wpath.views.home', name='home'),
	url(r'^test/', 'wpath.views.test', name='test'),



)

urlpatterns += staticfiles_urlpatterns()