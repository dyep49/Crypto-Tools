class CreateCoins < ActiveRecord::Migration
  def change
    create_table :coins do |t|
      t.string :name

      t.timestamps
    end
  end
end
