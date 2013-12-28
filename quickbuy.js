// Replaces Buy Now buttons with Quick Buy

$J('.item_market_action_button').each(function() {
  var $el = $J(this);
  var $qb = $el.clone()
    .attr('href', $el.attr('href').replace('BuyMarketListing', 'QuickBuy'))
  $qb.find('.item_market_action_button_contents').text('Quick Buy');
  $el.replaceWith($qb);
});

QuickBuy = function( sElementPrefix, listingid, appid, contextid, itemid ) {
  BuyItemDialog.Show( sElementPrefix, listingid, g_rgAssets[appid][contextid][itemid] );
  
  $('market_buynow_dialog_accept_ssa').checked = true;
  
  this.m_bPurchaseClicked = true;
  $('market_buynow_dialog_error').hide();

  $('market_buynow_dialog_purchase_throbber').clonePosition( $('market_buynow_dialog_purchase') );
  $('market_buynow_dialog_purchase').fade({ duration: 0.25 });
  $('market_buynow_dialog_purchase_throbber').show();
  $('market_buynow_dialog_purchase_throbber').fade({ duration: 0.25, from: 0, to: 1 });
  
  $J.ajax( {
    url: 'https://steamcommunity.com/market/buylisting/' + listingid,
    type: 'POST',
    data: {
      sessionid: g_sessionID,
      currency: g_rgWalletInfo['wallet_currency'],
      subtotal: this.m_nSubtotal,
      fee: this.m_nFeeAmount,
      total: this.m_nTotal
    },
    crossDomain: true,
    xhrFields: { withCredentials: true }
  } ).done( function ( data ) {
    BuyItemDialog.OnSuccess( { responseJSON: data } );
  } ).fail( function( jqxhr ) {
    // jquery doesn't parse json on fail
    var data = $J.parseJSON( jqxhr.responseText );
    BuyItemDialog.OnFailure( { responseJSON: data } );
  } );
};

QuickBuy = QuickBuy.bind(BuyItemDialog);