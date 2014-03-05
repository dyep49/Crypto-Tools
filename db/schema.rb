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

ActiveRecord::Schema.define(version: 20140304191007) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "arbitrages", force: true do |t|
    t.string   "buy_exchange"
    t.string   "sell_exchange"
    t.string   "primary"
    t.string   "secondary"
    t.float    "quantity"
    t.float    "profit"
    t.float    "lowest_ask"
    t.float    "highest_bid"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "coinpairs", force: true do |t|
    t.string   "primary"
    t.string   "secondary"
    t.integer  "exchange_id"
    t.integer  "market_id"
    t.float    "last_trade"
    t.float    "volume"
    t.datetime "last_trade_time"
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
    t.integer  "coinpair_id"
    t.string   "order_type"
    t.float    "quantity"
    t.float    "price"
    t.float    "total"
    t.datetime "created_at"
    t.datetime "updated_at"
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
