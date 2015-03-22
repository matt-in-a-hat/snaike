'use strict';
/*globals Mongo,Meteor,Template,Session*/

var Snaikes = new Mongo.Collection('snaikes')

if (Meteor.isClient) {

  var newSnaike = function () {
    return {
      name: 'what',
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

  Template.creation.events({
    'submit .edit-snaike': function (event) {

      Snaikes.insert({
        createdAt: new Date(),
        name: event.target.name.value,
        version: Session.get('viewedSnaike').version + 1
      })

      Session.set('viewedSnaike', newSnaike())
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