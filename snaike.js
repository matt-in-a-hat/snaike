'use strict';
/*globals Mongo,Meteor,Template,Session,$*/

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
      return Snaikes.find({}, {sort: {version: -1, createdAt: -1}})
    },
    viewedSnaike: function () {
      return Session.get('viewedSnaike')
    }
  })
  Template.body.onRendered(function () {
    // Clear db of snaikes
    // Snaikes.find({}).forEach(function (s) { Snaikes.remove(s._id) })
    window.initGame()
  })

  var getSnaike = function () {
    var snaike = Session.get('viewedSnaike')
    var latest;
    var originalId = snaike.originalId ? snaike.originalId : snaike._id
    if (originalId) {
      latest = Snaikes.findOne({ originalId: originalId }, {sort: {version: -1}})
      console.log(latest)
    }
    return {
      createdAt: new Date(),
      name: $('.edit-snaike [name=name]').val() || 'Nameless',
      colour: $('.edit-snaike [name=colour]').val() || '#DDD',
      code: $('.edit-snaike [name=code]').val(),
      version: latest ? latest.version + 1 : snaike.version + 1,
      originalId: originalId
    }
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

  Template.body.events({
    'click .battle': function () {
      var ids = []
      $('.snaike-list input:checked').each(function () {
        ids.push($(this).attr('data-id'))
      })
      var snaikes = Snaikes.find({ _id: { $in: ids } }).fetch()
      console.log(ids, snaikes)
      if (snaikes.length > 0) {
        window.startGame(snaikes)
      }
      return false
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  })
}
