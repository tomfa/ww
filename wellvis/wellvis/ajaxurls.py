from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Hierarchy navigation
    url(r'^get/well/(?P<wellpk>[0-9]+)$', 'wellvis.ajaxviews.wellupdate', name='get-well'),
    url(r'^get/userconfig/(?P<userpk>[0-9]+)$', 'wellvis.ajaxviews.userconfig', name='get-config'),

)

urlpatterns += staticfiles_urlpatterns()