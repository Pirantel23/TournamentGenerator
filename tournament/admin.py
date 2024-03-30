from django.contrib import admin
from .models import Team, Member, Tournament, Round, Match

# Register your models here.
admin.site.register(Team)
admin.site.register(Member)
admin.site.register(Tournament)
admin.site.register(Round)
admin.site.register(Match)