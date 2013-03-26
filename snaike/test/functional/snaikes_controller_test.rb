require 'test_helper'

class SnaikesControllerTest < ActionController::TestCase
  setup do
    @snaike = snaikes(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:snaikes)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create snaike" do
    assert_difference('Snaike.count') do
      post :create, snaike: { ai: @snaike.ai, colour: @snaike.colour, name: @snaike.name }
    end

    assert_redirected_to snaike_path(assigns(:snaike))
  end

  test "should show snaike" do
    get :show, id: @snaike
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @snaike
    assert_response :success
  end

  test "should update snaike" do
    put :update, id: @snaike, snaike: { ai: @snaike.ai, colour: @snaike.colour, name: @snaike.name }
    assert_redirected_to snaike_path(assigns(:snaike))
  end

  test "should destroy snaike" do
    assert_difference('Snaike.count', -1) do
      delete :destroy, id: @snaike
    end

    assert_redirected_to snaikes_path
  end
end
