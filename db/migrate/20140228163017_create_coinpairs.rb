class CreateCoinpairs < ActiveRecord::Migration
  def change
    create_table :coinpairs do |t|
      t.string :primary
      t.string :secondary
      t.integer :exchange_id
      t.integer :market_id
      t.float :last_trade
      t.float :volume
      t.datetime :last_trade_time
      t.timestamps
    end
  end
end
