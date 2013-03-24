class SnaikesController < ApplicationController
  # GET /snaikes
  # GET /snaikes.json
  def home
    @snaikes = Snaike.all
    @snaike = Snaike.new
  end

  # GET /snaikes
  # GET /snaikes.json
  def index
    @snaikes = Snaike.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @snaikes }
    end
  end

  # GET /snaikes/1
  # GET /snaikes/1.json
  def show
    @snaike = Snaike.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @snaike }
    end
  end

  # GET /snaikes/new
  # GET /snaikes/new.json
  def new
    @snaike = Snaike.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @snaike }
    end
  end

  # GET /snaikes/1/edit
  def edit
    @snaike = Snaike.find(params[:id])
  end

  # POST /snaikes
  # POST /snaikes.json
  def create
    @snaike = Snaike.new(params[:snaike])

    respond_to do |format|
      if @snaike.save
        format.html { redirect_to @snaike, notice: 'Snaike was successfully created.' }
        format.json { render json: @snaike, status: :created, location: @snaike }
      else
        format.html { render action: "new" }
        format.json { render json: @snaike.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /snaikes/1
  # PUT /snaikes/1.json
  def update
    create
  end

end
