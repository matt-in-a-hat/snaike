class Snaike < ActiveRecord::Base
  attr_accessible :ai, :colour, :name

  validates :name,  :presence => true,
                    :length => { :minimum => 1 },
                    :uniqueness => true
end
