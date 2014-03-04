class CreateCoinpairs < ActiveRecord::Migration
  def change
    create_table :coinpairs do |t|
      t.string :primary
      t.string :secondary
      t.integer :exchange_id
      t.integer :market_id
      t.timestamps
    end
  end
end
