import { AlertTriangle, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

type AlertSeverity = 'OUT_OF_STOCK' | 'CRITICAL' | 'LOW' | 'IN_STOCK';

interface AlertChipProps {
    severity: AlertSeverity;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
}

const AlertChip = ({ severity, size = 'md', showIcon = true }: AlertChipProps) => {
    const severityConfig = {
        OUT_OF_STOCK: {
            label: 'Out of Stock',
            bgColor: 'bg-red-100',
            textColor: 'text-red-700',
            borderColor: 'border-red-300',
            icon: <XCircle className="w-4 h-4" />
        },
        CRITICAL: {
            label: 'Critical Low',
            bgColor: 'bg-orange-100',
            textColor: 'text-orange-700',
            borderColor: 'border-orange-300',
            icon: <AlertCircle className="w-4 h-4" />
        },
        LOW: {
            label: 'Low Stock',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-700',
            borderColor: 'border-yellow-300',
            icon: <AlertTriangle className="w-4 h-4" />
        },
        IN_STOCK: {
            label: 'In Stock',
            bgColor: 'bg-green-100',
            textColor: 'text-green-700',
            borderColor: 'border-green-300',
            icon: <CheckCircle className="w-4 h-4" />
        }
    };

    const config = severityConfig[severity];

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base'
    };

    return (
        <span className={`
            inline-flex items-center gap-1.5 
            ${sizeClasses[size]} 
            ${config.bgColor} 
            ${config.textColor} 
            ${config.borderColor}
            border
            rounded-full 
            font-medium
            transition-all
            hover:scale-105
        `}>
            {showIcon && config.icon}
            <span>{config.label}</span>
        </span>
    );
};

export default AlertChip;
