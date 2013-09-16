# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Field'
        db.create_table(u'main_field', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('short_name', self.gf('django.db.models.fields.CharField')(max_length=6)),
            ('description', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('country', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Country'])),
        ))
        db.send_create_signal(u'main', ['Field'])

        # Adding model 'Country'
        db.create_table(u'main_country', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('short_name', self.gf('django.db.models.fields.CharField')(max_length=6)),
            ('country_code', self.gf('django.db.models.fields.CharField')(max_length=10)),
            ('description', self.gf('django.db.models.fields.CharField')(max_length=100)),
        ))
        db.send_create_signal(u'main', ['Country'])

        # Adding model 'Well'
        db.create_table(u'main_well', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('short_name', self.gf('django.db.models.fields.CharField')(max_length=6)),
            ('description', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('platform', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Platform'])),
        ))
        db.send_create_signal(u'main', ['Well'])

        # Adding model 'Platform'
        db.create_table(u'main_platform', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=30)),
            ('short_name', self.gf('django.db.models.fields.CharField')(max_length=6)),
            ('latitude', self.gf('django.db.models.fields.DecimalField')(max_digits=8, decimal_places=6)),
            ('longitude', self.gf('django.db.models.fields.DecimalField')(max_digits=9, decimal_places=6)),
            ('description', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('field', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Field'])),
        ))
        db.send_create_signal(u'main', ['Platform'])


    def backwards(self, orm):
        # Deleting model 'Field'
        db.delete_table(u'main_field')

        # Deleting model 'Country'
        db.delete_table(u'main_country')

        # Deleting model 'Well'
        db.delete_table(u'main_well')

        # Deleting model 'Platform'
        db.delete_table(u'main_platform')


    models = {
        u'main.country': {
            'Meta': {'object_name': 'Country'},
            'country_code': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'short_name': ('django.db.models.fields.CharField', [], {'max_length': '6'})
        },
        u'main.field': {
            'Meta': {'object_name': 'Field'},
            'country': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Country']"}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'short_name': ('django.db.models.fields.CharField', [], {'max_length': '6'})
        },
        u'main.platform': {
            'Meta': {'object_name': 'Platform'},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'field': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Field']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'latitude': ('django.db.models.fields.DecimalField', [], {'max_digits': '8', 'decimal_places': '6'}),
            'longitude': ('django.db.models.fields.DecimalField', [], {'max_digits': '9', 'decimal_places': '6'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'short_name': ('django.db.models.fields.CharField', [], {'max_length': '6'})
        },
        u'main.well': {
            'Meta': {'object_name': 'Well'},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'platform': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Platform']"}),
            'short_name': ('django.db.models.fields.CharField', [], {'max_length': '6'})
        }
    }

    complete_apps = ['main']