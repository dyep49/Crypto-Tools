class CreateExchanges < ActiveRecord::Migration
  def change
    create_table :exchanges do |t|
      t.string :name
      t.float :buy_fee
      t.float :sell_fee

      t.timestamps
    end
  end
end
