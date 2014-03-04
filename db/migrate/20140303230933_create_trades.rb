class CreateTrades < ActiveRecord::Migration
  def change
    create_table :trades do |t|
      t.integer :coinpair_id
      t.string :order_type
      t.float :quantity
      t.float :price
      t.datetime :datetime
      t.integer :trade_id

      t.timestamps
    end
  end
end
