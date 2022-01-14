# Space-Daily
A simple to use webpage that displays the image of the day from Nasa.
Liked images can be filtered for later viewing.

## Update v1.1
Made it easier to use submodule to add to existing django project. By removing the Django project folder so this acts as an app that can be added to any django project.
Detailed setup instructions added below.

## Update v1.0
Finished the app. Added liked images to local storage & the ability to share images.
Redesigned color pallate and logo. See design folder for design outline.

# Setup
Add the space_daily folder to the django project folder to add it as an app.

Add the following to your django project urls.py:

    from django.urls import path, include

    urlpatterns = [
        path('', include('space_daily.urls')),

    ]

Add the following to your django project settings.py:

    INSTALLED_APPS = [
        'space_daily.apps.SpaceDailyConfig',
        ...
    ]