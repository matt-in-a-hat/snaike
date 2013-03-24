class CreateSnaikeVars < ActiveRecord::Migration
  def change
    create_table :snaike_vars do |t|
      t.string :varname
      t.text :varvalue

      t.timestamps
    end
  end
end
