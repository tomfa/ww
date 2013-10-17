from django.conf.urls import patterns, url

urlpatterns = patterns('',
    # Hierarchy navigation
    url(r'^get/well/(?P<wellpk>[0-9]+)$', 'wellvis.ajax.get_wellJSON', name='get-well'),
    url(r'^update/well/(?P<wellpk>[0-9]+)$', 'wellvis.ajax.update_wellJSON', name='update-well'),
    url(r'^get/3dconfig$', 'wellvis.ajax.get_3dconfig', name='get-3dconfig'),
    url(r'^update/3dconfig$', 'wellvis.ajax.update_3dconfig', name='update-3dconfig'),
    #url(r'^get/userconfig/(?P<userpk>[0-9]+)$', 'wellvis.ajaxviews.userconfig', name='get-config'),

)