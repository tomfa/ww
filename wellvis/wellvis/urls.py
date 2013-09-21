from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', 'wellvis.views.home', name='home'),
    url(r'^dashboard/', 'wellvis.views.dashboard', name='dashboard'),

    # Modules
    (r'^wpath/', include('wpath.urls')),
    (r'^wcp/', include('wcp.urls')),
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