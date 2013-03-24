class CreateSnaikes < ActiveRecord::Migration
  def change
    create_table :snaikes do |t|
      t.string :name
      t.text :ai
      t.string :colour

      t.timestamps
    end
  end
end
