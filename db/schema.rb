# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140303230933) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "coinpairs", force: true do |t|
    t.string   "primary"
    t.string   "secondary"
    t.integer  "exchange_id"
    t.integer  "market_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "coins", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "exchanges", force: true do |t|
    t.string   "name"
    t.float    "buy_fee"
    t.float    "sell_fee"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "orders", force: true do |t|
    t.integer "coinpair_id"
    t.string  "order_type"
    t.float   "quantity"
    t.float   "price"
    t.float   "total"
  end

  create_table "trades", force: true do |t|
    t.integer  "coinpair_id"
    t.string   "order_type"
    t.float    "quantity"
    t.float    "price"
    t.datetime "datetime"
    t.integer  "trade_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
