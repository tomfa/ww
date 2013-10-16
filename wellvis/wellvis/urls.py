from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'wellvis.views.home', name='home'),
    url(r'^dashboard/', 'wellvis.views.dashboard', name='dashboard'),

    # Hierarchy navigation
    url(r'^country/(?P<countryid>[0-9]+)$', 'wellvis.views.view_country', name='view-country'),
    url(r'^field/(?P<fieldid>[0-9]+)$', 'wellvis.views.view_field', name='view-field'),
    url(r'^platform/(?P<platformid>[0-9]+)$', 'wellvis.views.view_platform', name='view-platform'),
    url(r'^well/(?P<wellid>[0-9]+)$', 'wellvis.views.view_well', name='view-well'),

    # Modules
    (r'^wpath/', include('wpath.urls')),
    (r'^wcp/', include('wcp.urls')),
    (r'^ajax/', include('wellvis.ajaxurls')),
    (r'^wdesign/', include('wdesign.urls')),
    (r'^wplan/', include('wplan.urls')),
    (r'^wreport/', include('wreport.urls')),
    (r'^wsupport/', include('wsupport.urls')),

    # Admin documentation
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Admin-panel
    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += staticfiles_urlpatterns()