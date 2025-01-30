<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Log;

class PriceUpdateCompleted extends Notification implements ShouldBroadcast
{
    use Queueable;

    public $percent;

    public function __construct($percent)
    {
        $this->percent = $percent;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast', 'mail'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => "A atualização de preços foi concluída com {$this->percent}%.",
        ];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Atualização de Preços Concluída')
            ->line("A atualização de preços foi concluída com um ajuste de {$this->percent}%.")
            ->action('Ver Produtos', url('/products'))
            ->line('Obrigado por utilizar nosso sistema!');
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => "A atualização de preços foi concluída com {$this->percent}%.",
        ]);
    }

    public function toLog($notifiable)
    {
        Log::info("Notificação enviada: A atualização de preços foi concluída com {$this->percent}%.");
    }
}
