using System;
using System.Collections.Generic;

namespace ImageViewer.API.Models
{
    public class ImageModel
    {
        public ImageModel()
        {
            Tags = new List<ImageTag>();
        }

        public string Id { get; set; }
        public string Key { get; set; }
        public long Size { get; set; }
        public DateTime LastModified { get; set; }
        public string ETag { get; set; }
        public List<ImageTag> Tags { get; set; }
    }

    public class ImageTag
    {
        public string Tag { get; set; }
        public string Value { get; set; }
    }

}
