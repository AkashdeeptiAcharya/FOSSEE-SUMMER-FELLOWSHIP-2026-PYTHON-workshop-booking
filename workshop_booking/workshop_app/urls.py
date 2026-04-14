"""workshop_portal URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.urls import path
from django.conf.urls import url
from workshop_app import api_views, views


app_name = "workshop_app"

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^register/$', views.user_register, name="register"),
    url(r'^activate_user/(?P<key>.+)$', views.activate_user),
    url(r'^activate_user/$', views.activate_user),
    url(r'^login/$', views.user_login, name="login"),
    url(r'^logout/$', views.user_logout, name="logout"),
    url(r'^status$', views.workshop_status_coordinator,
        name='workshop_status_coordinator'),
    url(r'^dashboard$', views.workshop_status_instructor,
        name='workshop_status_instructor'),
    url(r'^accept_workshop/(?P<workshop_id>\d+)', views.accept_workshop,
        name='accept_workshop'),
    url(r'^change_workshop_date/(?P<workshop_id>\d+)$',
        views.change_workshop_date, name='change_workshop_date'),
    url(r'^details/(?P<workshop_id>\d+)$', views.workshop_details,
        name='workshop_details'),
    url(r'^type_details/(?P<workshop_type_id>\d+)$',
        views.workshop_type_details, name='workshop_type_details'),
    url(r'^type_tnc/(?P<workshop_type_id>\d+)$',
        views.workshop_type_tnc, name='workshop_type_tnc'),
    url(r'^propose/$', views.propose_workshop,
        name='propose_workshop'),
    url(r'^add_workshop_type$', views.add_workshop_type,
        name='add_workshop_type'),
    url(r'^delete_attachment_file/(?P<file_id>\d+)$',
        views.delete_attachment_file, name='delete_attachment_file'),
    url(r'^types/$', views.workshop_type_list,
        name='workshop_type_list'),
    url(r'^view_profile/$', views.view_own_profile,
        name='view_own_profile'),
    url(r'^view_profile/(?P<user_id>\d+)$', views.view_profile,
        name='view_profile'),
    
    path('api/session/', api_views.session_api, name='api_session'),
    path('api/auth/login/', api_views.login_api, name='api_login'),
    path('api/auth/logout/', api_views.logout_api, name='api_logout'),
    path('api/register/', api_views.register_api, name='api_register'),
    path('api/meta/', api_views.session_api, name='api_meta'),
    path('api/workshop-types/', api_views.workshop_types_api, name='api_workshop_types'),
    path('api/workshops/', api_views.dashboard_api, name='api_dashboard'),
    path('api/workshops/<int:workshop_id>/', api_views.workshop_details_api, name='api_workshop_details'),
    path('api/workshops/<int:workshop_id>/comments/', api_views.workshop_comment_api, name='api_workshop_comment'),
    path('api/workshops/<int:workshop_id>/accept/', api_views.accept_workshop_api, name='api_accept_workshop'),
    path('api/workshops/<int:workshop_id>/change-date/', api_views.change_workshop_date_api, name='api_change_workshop_date'),
    path('api/propose/', api_views.propose_workshop_api, name='api_propose_workshop'),
    path('api/profile/', api_views.profile_api, name='api_profile'),
    path('api/profile/update/', api_views.update_profile_api, name='api_profile_update'),
    path('api/public-stats/', api_views.public_stats_api, name='api_public_stats'),
]
