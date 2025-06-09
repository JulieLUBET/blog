import { Button, Space } from "antd";
import PropTypes from "prop-types";

export default function SocialLinks(props) {
    return (
        <Space>
            {/* Bouton Ant Design avec props dynamiques */}
          <Button
            type={props.type || "default"} // Par défaut, le bouton aura le style "default"
            onClick={props.onClick} // Action au clic
            icon={props.icon} // Icône optionnelle
            title={props.title} // titre optionnelle
          >
          </Button>
        </Space>
    );
  }