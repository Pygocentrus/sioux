class ErrorsController < ApplicationController
  def index
  end

  def log_error
    # Here you can easily manipulate the error
    # for instance you can send a mail or open an issue

    response = Hash.new
    response[:message] = "The error has been submitted successfully"
    response[:status] = 200
    render :json => response
  end
end
