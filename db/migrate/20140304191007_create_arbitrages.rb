class CreateArbitrages < ActiveRecord::Migration
  def change
    create_table :arbitrages do |t|
      t.string :buy_exchange
      t.string :sell_exchange
      t.string :primary
      t.string :secondary
      t.float :quantity
      t.float :profit
      t.float :lowest_ask
      t.float :highest_bid

      t.timestamps
    end
  end
end
