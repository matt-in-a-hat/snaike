'use strict';
/*globals Mongo,Meteor,Template,Session*/

var Snaikes = new Mongo.Collection('snaikes')

if (Meteor.isClient) {

  var newSnaike = function () {
    return {
      name: '',
      colour: '',
      code: 'return 0;',
      createdAt: new Date(),
      version: 0
    }
  }

  Session.set('viewedSnaike', newSnaike())

  Template.body.helpers({
    snaikes: function () {
      return Snaikes.find({}, {sort: {createdAt: -1}})
    },
    viewedSnaike: function () {
      return Session.get('viewedSnaike')
    }
  })
  Template.body.onRendered(function () {
    window.initGame()
  })

  var getSnaike = function () {
    var snaike = Session.get('viewedSnaike')
    snaike.createdAt = new Date()
    snaike.name = $('.edit-snaike .name').val() || 'Nameless'
    snaike.colour = $('.edit-snaike .colour').val() || '#DDD'
    snaike.code = $('.edit-snaike .code').val()
    snaike.version = snaike.version + 1
    return snaike
  }

  Template.creation.events({
    'submit .edit-snaike': function () {
      Snaikes.insert(getSnaike())
      Session.set('viewedSnaike', newSnaike())
      return false
    },
    'click .test': function () {
      var snaike = getSnaike()
      window.startGame([snaike])
      return false
    }
  })

  Template.snaike.events({
    'click .select': function () {
    },
    'click .view': function () {
      Session.set('viewedSnaike', this)
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  })
}
