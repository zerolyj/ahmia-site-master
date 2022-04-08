"""Forms used in Ahmia."""
import logging

from django import forms
from django.conf import settings
from django.core.mail import send_mail
from django.utils.translation import ugettext as _

from .validators import validate_onion_url, validate_status


logger = logging.getLogger("ahmia")


class AddOnionForm(forms.Form):
    """Request to add an onion domain."""
    onion = forms.CharField(
        validators=[validate_onion_url, validate_status],
        widget=forms.TextInput(
            attrs={'placeholder': _('Enter your .onion address here')}
        )
    )

    def send_new_onion(self):
        """Send a new onion request by email."""
        if settings.DEBUG:
            return
        subject = "Hidden service add onion request"
        message = "User requests to add the following onion url {0}".format(
            self.cleaned_data['onion']
        )
        try:
            send_mail(subject, message,
                      settings.DEFAULT_FROM_EMAIL, settings.RECIPIENT_LIST,
                      fail_silently=False)
        except IOError as e:
            logger.exception(e)


class ReportOnionForm(forms.Form):
    """Report an onion domain."""
    onion = forms.CharField(
        validators=[validate_onion_url, validate_status],
        widget=forms.TextInput(
            attrs={'placeholder': _('Enter your .onion address here')}
        )
    )

    def send_abuse_report(self):
        """Send an abuse report by email."""
        if settings.DEBUG:
            return
        subject = "Hidden service abuse notice"
        message = "User sent abuse notice for onion url {0}".format(
            self.cleaned_data['onion']
        )
        send_mail(subject, message,
                  settings.DEFAULT_FROM_EMAIL, settings.RECIPIENT_LIST,
                  fail_silently=False)
