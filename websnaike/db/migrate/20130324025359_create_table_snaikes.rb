class CreateTableSnaikes < ActiveRecord::Migration
  def up
  	create_table :snaikes do |t|
  		t.string :ai
  		t.string :colour
  		t.string :name
  		
  	end
  end

  def down
  	drop_table :snaikes
  end
end
