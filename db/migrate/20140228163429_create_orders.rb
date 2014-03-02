class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.integer :coinpair_id
      t.string :order_type
      t.float :quantity
      t.float :price
      t.float :total

      t.timestamps
    end
  end
end
