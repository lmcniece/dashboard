<!-- STOCK CHART -->
<div id="stock-chart-modal" class="modal fade" role="dialog">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title"></h4>
				</div>
				<div class="modal-body">
					<div id="chart-container" class="form-inline">
						<div class="form-group">
							<input type="number" class="form-control" id="chart-period" placeholder="Period">
							<select class="form-control" id="chart-period-type">
								<option value="d">Days</option>
								<option value="M">Month</option>
								<option value="Y">Year</option>
							</select>
							<i id="update-chart" class="fa fa-refresh" aria-hidden="true"></i>
						</div>
						<p id="current-stock-chart"></p>
						<div><img id="stock-chart"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!--TRANSACTION ENTRY-->
<div id="transaction-entry-modal" class="modal fade" role="dialog">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title"></h4>
				</div>
				<div class="modal-body">
					<div id="transaction-account-autocomplete" class="form-group">
						<input id="transaction-account" class="form-control" type="text" placeholder="Transaction Account">
					</div>
					<div id="transaction-category-autocomplete" class="form-group">
						<input id="transaction-category" class="form-control" type="text" placeholder="Account Tag">
					</div>
					<div class="form-group">
						<input type="number" id="transaction-amount" class="form-control" placeholder="0.00">
						<input type="date" id="transaction-date" class="form-control">
						<select class="form-control" id="transaction-type">
							<option value="debit">Debit</option>
							<option value="credit">Credit</option>
						</select>
						<button id="submit-new-transaction" class="form-control" data-dismiss="modal">Submit</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<!--Default Values-->
<script>$(function(){$('#transaction-date').val(date_iso(today));});</script>

<!--NOTIFICAITONS-->
<div id="notification-modal" class="modal fade" role="dialog">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title">Alert</h4>
				</div>
				<div class="modal-body">
				</div>
			</div>
		</div>
	</div>
</div>
<script>
<!--Notification box !-->
function notification_modal(notification){
	$('#notification-modal .modal-body').html('<div><h4>'+notification+'</h4></div>');
	$('#notification-modal').modal('show');
};
</script>

<!--BANK CASH EDIT-->
<div id="bank-edit-modal" class="modal fade" role="dialog">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title"></h4>
				</div>
				<div class="modal-body">
					<div class="form-group">
						<input type="number" id="bank-amount" class="form-control" placeholder="0.00">
						<button id="submit-bank-edit" class="form-control" data-dismiss="modal">Submit</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>