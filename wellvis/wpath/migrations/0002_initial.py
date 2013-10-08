# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Algorithm'
        db.create_table(u'wpath_algorithm', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(unique=True, max_length=30)),
            ('short_name', self.gf('django.db.models.fields.CharField')(unique=True, max_length=4)),
            ('description', self.gf('django.db.models.fields.CharField')(max_length=300)),
        ))
        db.send_create_signal(u'wpath', ['Algorithm'])

        # Adding model 'HelpPointType'
        db.create_table(u'wpath_helppointtype', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(unique=True, max_length=20)),
            ('short_name', self.gf('django.db.models.fields.CharField')(unique=True, max_length=4)),
            ('description', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('hex_color', self.gf('django.db.models.fields.CharField')(max_length=6)),
        ))
        db.send_create_signal(u'wpath', ['HelpPointType'])

        # Adding model 'Path'
        db.create_table(u'wpath_path', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('version', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('algorithm', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['wpath.Algorithm'])),
            ('project', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['main.Project'])),
        ))
        db.send_create_signal(u'wpath', ['Path'])

        # Adding model 'HelpPoint'
        db.create_table(u'wpath_helppoint', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('depth', self.gf('django.db.models.fields.PositiveIntegerField')()),
            ('direction', self.gf('django.db.models.fields.IntegerField')()),
            ('inclination', self.gf('django.db.models.fields.IntegerField')()),
            ('radius', self.gf('django.db.models.fields.PositiveIntegerField')(null=True)),
            ('type', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['wpath.HelpPointType'])),
            ('wpath', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['wpath.Path'])),
            ('previous_point', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='previous_helppoint', null=True, to=orm['wpath.HelpPoint'])),
            ('next_point', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='next_helppoint', null=True, to=orm['wpath.HelpPoint'])),
        ))
        db.send_create_signal(u'wpath', ['HelpPoint'])


    def backwards(self, orm):
        # Deleting model 'Algorithm'
        db.delete_table(u'wpath_algorithm')

        # Deleting model 'HelpPointType'
        db.delete_table(u'wpath_helppointtype')

        # Deleting model 'Path'
        db.delete_table(u'wpath_path')

        # Deleting model 'HelpPoint'
        db.delete_table(u'wpath_helppoint')


    models = {
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'main.project': {
            'Meta': {'object_name': 'Project'},
            'end_date': ('django.db.models.fields.DateTimeField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '30'}),
            'responsible': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'project_responsible'", 'to': u"orm['auth.User']"}),
            'start_date': ('django.db.models.fields.DateTimeField', [], {}),
            'users': ('django.db.models.fields.related.ManyToManyField', [], {'related_name': "'project_users'", 'symmetrical': 'False', 'to': u"orm['auth.User']"})
        },
        u'wpath.algorithm': {
            'Meta': {'object_name': 'Algorithm'},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '300'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'}),
            'short_name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '4'})
        },
        u'wpath.helppoint': {
            'Meta': {'object_name': 'HelpPoint'},
            'depth': ('django.db.models.fields.PositiveIntegerField', [], {}),
            'direction': ('django.db.models.fields.IntegerField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'inclination': ('django.db.models.fields.IntegerField', [], {}),
            'next_point': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'next_helppoint'", 'null': 'True', 'to': u"orm['wpath.HelpPoint']"}),
            'previous_point': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'previous_helppoint'", 'null': 'True', 'to': u"orm['wpath.HelpPoint']"}),
            'radius': ('django.db.models.fields.PositiveIntegerField', [], {'null': 'True'}),
            'type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['wpath.HelpPointType']"}),
            'wpath': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['wpath.Path']"})
        },
        u'wpath.helppointtype': {
            'Meta': {'object_name': 'HelpPointType'},
            'description': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'hex_color': ('django.db.models.fields.CharField', [], {'max_length': '6'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '20'}),
            'short_name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '4'})
        },
        u'wpath.path': {
            'Meta': {'object_name': 'Path'},
            'algorithm': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['wpath.Algorithm']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['main.Project']"}),
            'version': ('django.db.models.fields.PositiveIntegerField', [], {})
        }
    }

    complete_apps = ['wpath']